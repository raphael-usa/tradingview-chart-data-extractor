import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';

import { Provider, useSelector } from 'react-redux';
import { RootState } from './app/store';

import Container from '@mui/material/Container';

import TradingviewContainer from './features/tradingview/TradingViewContainer';

function App() {
  const counter = useSelector((state: RootState) => state.counter);
  return (
    <div className="App">

      <Container>
        <TradingviewContainer />
      </Container>

      <Container>
      <div className='ABC_second'>
        <hr /> <hr /> <hr />
        counter redux state: {JSON.stringify(counter)}
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <Counter />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </div>
      </Container>

    </div>
  );
}

export default App;
