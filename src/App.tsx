import "./App.css"
import { Counter } from "./features/counter/Counter"
import { useContext } from "react"
import { Quotes } from "./features/quotes/Quotes"
import logo from "./logo.svg"
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { Button } from 'primereact/button';
import { toggleTheme } from './utils/theme.js';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';

import TodoList from './TodoList';

import { Link, Routes, Route } from "react-router-dom";


function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <a href="/home.html">Go to the home page of the app</a>
      </p>
    </div>
  );
}

function Settings() {
  return (
    <div>
      <h2>Settings</h2>
      <p>
        <a href="/home.html">Go to the home page of the app</a>
      </p>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <p>
        <a href="/home.html">Go to the home page of the app</a>
      </p>
    </div>
  );
}

const App = () => {
  console.log("App.tsx");

  return (
    <PrimeReactProvider>
      <div className="App" style={{ margin: '10px' }}>
      <span><h2><Link to="/settings">Settings</Link></h2></span>
      <span><h2><Link to="/">Home</Link></h2></span>

        <div className="card flex justify-content-center">
          <Button onClick={toggleTheme} label="Toggle Theme" icon="pi pi-check" />
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>

        <hr />

        <Card title="TodoList demo, add to redux, send runtime.sendMessage to background">
          <TodoList />
        </Card>

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Counter />
          <p>
            Edit <code>src/App.tsx</code> and save to reload....
          </p>
        </header>

        <hr />
        <Quotes />
        <span>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
        </span>
      </div>
    </PrimeReactProvider>
  )
}

export default App
