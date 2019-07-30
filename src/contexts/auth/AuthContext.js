import React from 'react';

import api, {getErrorsFromResponse} from '../../api';

export const AuthContext = React.createContext();
const user = JSON.parse(localStorage.getItem('user')) || {};

export class AuthContextProvider extends React.Component {
    initialState = {
        token: undefined,
        email: undefined,
        username: undefined,
        first_name: undefined,
        last_name: undefined,
        organization: undefined,
        user_type: undefined
    };
    state = user ? user : this.initialState;

    login = (data, config) => {
        api.post('/users/obtain_auth_token/', {
            username: data.username,
            password: data.password
        }).then(response => {
            config.onSuccess();
        }).catch(error => {
            config.onError({errors: getErrorsFromResponse(error)});
        });
    };

    logout = (config) => {
        localStorage.removeItem('user');
        this.setState(this.initialState);
        config.onSuccess();
    };

    getCurrentUser = () => {
        api.get('/users/user_info/').then(response => {
            const data = response.data;
            this.setState({
                email: data.email,
                username: data.username,
                first_name: data.first_name,
                last_name: data.last_name,
                organization: data.organization,
                user_type: data.user_type
            });
        }).catch(error => {
            localStorage.removeItem('user');
        });
    };

    sendRestorePasswordEmail = (emailOrUsername, config) => {
        api.post('/users/send_restore_password_email/', {
            email_or_username: emailOrUsername
        }).then(response => {
            config.onSuccess();
        }).catch(error => {
            config.onError({errors: getErrorsFromResponse(error)});
        });
    };

    validatePasswordResetRequest = (code, config) => {
        api.post('/users/validate_reset_password_request/', {
            code: code
        }).then(response => {
            config.onSuccess();
        }).catch(error => {
            config.onError({errors: getErrorsFromResponse(error)});
        });
    };

    setUserPassword = (code, password, config) => {
        api.post('/users/set_password/', {
            code: code,
            password: password
        }).then(response => {
            config.onSuccess();
        }).catch(error => {
            config.onError({errors: getErrorsFromResponse(error)});
        });
    };

    getActions = () => {
        return {
            login: this.login,
            logout: this.logout,
            getCurrentUser: this.getCurrentUser,
            sendRestorePasswordEmail: this.sendRestorePasswordEmail,
            validatePasswordResetRequest: this.validatePasswordResetRequest,
            setUserPassword: this.setUserPassword,
        }
    };

    render = () => {
        return <AuthContext.Provider value={{
            state: this.state,
            actions: this.getActions()
        }}>
            {this.props.children}
        </AuthContext.Provider>;
    }
}