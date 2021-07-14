import React, { useState, useEffect, useRef, Fragment } from 'react';
import onClickOutside from 'react-onclickoutside';
import './index.css';

const search = (searchTerm, options) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rx = new RegExp(`${searchTerm}`, 'i');
      const results = options.filter((str) => !!str.match(rx));
      if (results && results.length) {
        resolve(results);
      } else {
        resolve(null);
      }
    });
  });
};

function SearchDropdown({ placeholder, options, onSelectCallback }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(options);
  const [row, setRow] = useState(-1);
  const [open, setOpen] = useState(false);
  const ref = useRef({ value: '', highlighted: -1 });
  const currState = ref.current;

  const dropdownSelect = (v) => {
    currState.value = v;
    currState.highlighted = -1;
    onSelectCallback(v);
    setOpen(false);
  };

  SearchDropdown.handleClickOutside = () => {
    setOpen(false);
    currState.highlighted = -1;
  };

  useEffect(() => {
    if (!searchTerm.length) {
      setResults(options);
      currState.highlighted = -1;
      return;
    }
    if (searchTerm.length > 2) {
      search(searchTerm, options).then((res) => {
        setResults(res);
        currState.highlighted = -1;
      });
    }
  }, [searchTerm, currState, options]);

  useEffect(() => {
    const highlighted = currState.highlighted;
    if (highlighted < 0) {
      return;
    }
    const $ul = document.querySelector(`[data-row="${highlighted}"]`);
    const $li = document.querySelector('.dd-options-item.active');
    if ($li) {
      const $ulRect = $ul.getBoundingClientRect();
      const $liRect = $li.getBoundingClientRect();
      $ul.scrollTop = $li.offsetTop - $ulRect.height / 2 + $liRect.height / 2;
    }
  }, [row, currState.highlighted]);

  const onToggle = () => setOpen((prev) => !prev);
  const onChange = (e) => setSearchTerm(e.target.value);
  const onSelect = (e) => dropdownSelect(e.target.dataset.value);
  const onKeyDown = (e) => {
    const { key } = e;
    if (results && results.length && key !== 'Enter') {
      const highlighted = currState.highlighted;
      const max = results.length - 1;
      let newHighlighted;
      if (key === 'ArrowDown') {
        newHighlighted = highlighted + 1;
      }
      if (key === 'ArrowUp') {
        newHighlighted = highlighted - 1;
      }
      if (newHighlighted < 0) {
        newHighlighted = max;
      } else if (newHighlighted > max) {
        newHighlighted = 0;
      }
      currState.highlighted = newHighlighted;
      setRow(newHighlighted);
    }
    if (results && results.length && key === 'Enter') {
      console.log(`if (results.length && key === 'Enter') {`, row);
      dropdownSelect(results[row]);
    }
  };

  let content = null;
  if (results && results.length) {
    content = (
      <ul className="dd-options" data-row={row}>
        {results.map((item, index) => {
          const c =
            currState.highlighted === index
              ? 'dd-options-item active'
              : 'dd-options-item';
          return (
            <li
              key={item}
              data-index={index}
              data-value={item}
              className={c}
              onClick={onSelect}>
              {item}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="dd-wrapper" tabIndex={1} onKeyDown={onKeyDown}>
      <div className="dd-header" onClick={onToggle}>
        <div className="dd-header__title">{currState.value || placeholder}</div>
        <div className="dd-header__action">
          {
            open
              ? (<i className="fas fa-angle-up" />)
              : (<i className="fas fa-angle-down" />)
          }
        </div>
      </div>
      {open && (
        <Fragment>
          <div className="dd-textbox-wrapper">
            <input
              type="search"
              placeholder="search"
              value={searchTerm}
              onChange={onChange}
            />
          </div>
          <div className="dd-content-wrapper">{content}</div>
        </Fragment>
      )}
    </div>
  );
}

const clickOutsideConfig = {
  handleClickOutside: () => SearchDropdown.handleClickOutside
};

export default onClickOutside(SearchDropdown, clickOutsideConfig);
