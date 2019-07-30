import React, {useContext} from 'react';
import {Link} from 'react-router-dom';

import LoginForm from '../../components/auth/LoginForm';
import {AuthContext} from '../../contexts/auth/AuthContext';

export default function LoginPage(props) {
    const authContext = useContext(AuthContext);

    const onLogin = () => {
        authContext.actions.getCurrentUser();
        props.history.push('/');
    };

    return <div className='auth-wrapper'>
        <div className={'login-wrapper'}>
            <div className={'login-form-wrapper'}>
                <LoginForm onSubmit={onLogin}/>
                <Link to={'/forgot-password'} className={'link'}>Forgot password?</Link>
            </div>
        </div>
    </div>;
}