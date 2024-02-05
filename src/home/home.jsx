

// import React from "react"
// // import { HashRouter as Router, Route, Routes } from 'react-router-dom';

// import { createRoot } from "react-dom/client"


// // import { createSlice, configureStore } from '@reduxjs/toolkit';

// import { Provider } from "react-redux"


// import { createStore } from 'redux'
// // import devToolsEnhancer from 'remote-redux-devtools';
// import { devToolsEnhancer } from 'redux-devtools-extension/logOnlyInProduction';

// function counterReducer(state = { value: 0 }, action) {
//     switch (action.type) {
//         case 'counter/incremented':
//             return { value: state.value + 1 }
//         case 'counter/decremented':
//             return { value: state.value - 1 }
//         default:
//             return state
//     }
// }

// let store = createStore(counterReducer, devToolsEnhancer(), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// store.subscribe(() => console.log(store.getState()))

// store.dispatch({ type: 'counter/incremented' });

// window.store = store;

// const container = document.getElementById("root");


// if (container) {
//     const root = createRoot(container);

//     function add(){
//         store.dispatch({ type: 'counter/incremented' });
//     }

//     root.render(
//         <React.StrictMode>
//             <Provider store={store}>
//                 <>
//                     <h1>Home page</h1>
//                     {/* <h2>value: {store.state.value}</h2> */}
//                     <button onClick={add}>add</button>
//                 </>
//             </Provider>
//         </React.StrictMode>,
//     )
// } else {
//     throw new Error(
//         "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
//     )
// }

