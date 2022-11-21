import React from 'react';

import logo from './logo.svg';
import './App.scss';
import Graph from './components/Graph/Graph';

function App(): JSX.Element {
  return (
    <div className="App">
      <Graph></Graph>
    </div>
  );
}

export default App;
