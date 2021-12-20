import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from "notistack";
import SnackMessage from "./components/Messages/snackbar";
import { Provider } from "react-redux";
import store from "./store/store";
import { Web3ContextProvider } from "./hooks";

import * as serviceWorker from './serviceWorker';
import Root from './Root';

ReactDOM.render(
    <SnackbarProvider
        maxSnack={4}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
        content={(key, message: string) => <SnackMessage id={key} message={JSON.parse(message)} />}
        autoHideDuration={10000}
    >
        <Provider store={store}>
            <Web3ContextProvider>
                <Root />
            </Web3ContextProvider>
        </Provider>
    </SnackbarProvider>
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
