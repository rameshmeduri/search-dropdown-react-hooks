import React from 'react';
import SearchDropdown from './SearchDropdown';

const options = [
  'apple',
  'banana',
  'cherry',
  'blueberry',
  'blackberry',
  'watermelon',
  'rockmelon',
  'dragonfruit',
  'durian',
  'mango',
  'pineapple',
  'papaya'
];

const App = () => (
  <div className="container">
    <SearchDropdown
      placeholder="Select"
      options={options}
      onSelectCallback={(v) => {
        console.log('onSelectCallback --> ', v);
      }}
    />
  </div>
);

export default App;
