import React, {useContext} from 'react';
import {Route, Redirect} from 'react-router-dom';

import {AuthContext} from '../../contexts/auth/AuthContext';

export const PrivateRoute = function (props) {
    const authContext = useContext(AuthContext);
    return authContext.state.token ? <Route {...props}/> : <Redirect to={'/login'}/>;
};