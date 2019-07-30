import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import {LocaleProvider} from 'antd';
import en_US from 'antd/lib/locale-provider/en_US';
import moment from 'moment';

import {AuthContextProvider} from './contexts/auth/AuthContext';
import App from './containers/App';

import 'moment/locale/es-us';
import 'antd/dist/antd.css';

import './static/styles/Base.scss';


moment.locale('en');


ReactDOM.render(
    <BrowserRouter>
        <AuthContextProvider>
            <LocaleProvider locale={en_US}>
                <App/>
            </LocaleProvider>
        </AuthContextProvider>
    </BrowserRouter>,
    document.getElementById('root')
);
