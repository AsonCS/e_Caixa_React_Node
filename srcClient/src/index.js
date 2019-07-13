import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Switch } from 'react-router';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import * as serviceWorker from './serviceWorker';
import store from './store';

import './index.css';
import App from './components/App';
import Login from './components/Login';
import Manipulate from './components/Manipulate';
import NewClient from './components/NewClient';

const history = createBrowserHistory();


render(
    <Provider store={store}>
        <Router history={history}>
            <Switch>
                <Route exact path="/" component={App} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/manipulate" component={Manipulate} />
                <Route exact path="/new" component={NewClient} />
                <Route path="/*" component={() => <h1 style={{color:'red'}}>NOT FOUND!!!</h1>} />
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
