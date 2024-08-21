import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";

import Store from "src/stores";
import App from "./App";
import "./index.scss";

import LS from 'localnm/frontend/local-store/index'
const LS_KEY = 'blockchain-web-tool';

const store = new Store(
    LS(LS_KEY).get()
);

window.onbeforeunload = (e) => {
    const state = store.getState();
    LS(LS_KEY).set(state);
};


window.addEventListener('error', (e) => {
    console.log('window error')
    console.log(e)
})

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);
