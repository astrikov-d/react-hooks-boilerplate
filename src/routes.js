import React from 'react';
import Loadable from 'react-loadable';
import {Route, Switch} from 'react-router-dom';

import {PrivateRoute} from './components/router/PrivateRoute';
import {LoadingComponent} from './components/LoadingComponent';

/**
 * Auth related.
 */
const LoginPage = Loadable({
    loader: () => import('./containers/auth/LoginPage'),
    loading: LoadingComponent
});
const ForgotPassword = Loadable({
    loader: () => import('./containers/auth/ForgotPassword'),
    loading: LoadingComponent
});
const LogoutPage = Loadable({
    loader: () => import('./containers/auth/LogoutPage'),
    loading: LoadingComponent
});

/**
 * Dashboard and misc.
 */
const Dashboard = Loadable({
    loader: () => import('./containers/dashboard/Dashboard'),
    loading: LoadingComponent
});

export const routes = (
    <Switch>
        <Route exact path='/login' component={LoginPage}/>
        <Route exact path='/forgot-password' component={ForgotPassword}/>

        <PrivateRoute exact path='/' component={Dashboard}/>

        <PrivateRoute exact path='/logout' component={LogoutPage}/>
    </Switch>
);
