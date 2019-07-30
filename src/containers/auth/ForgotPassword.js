import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import {message} from 'antd';

import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import ValidatePasswordResetRequestForm from '../../components/auth/ValidatePasswordResetRequestForm';
import SetPasswordForm from '../../components/auth/SetPasswordForm';

export default function ForgotPassword(props) {
    const {history} = props;
    const [passwordResetRequestSent, setPasswordResetRequestSent] = useState(false);
    const [codeIsValid, setCodeIsValid] = useState(false);
    const [code, setCode] = useState(undefined);

    const onPasswordResetRequest = () => {
        setPasswordResetRequestSent(true);
    };

    const onValidCode = (code) => {
        setCodeIsValid(true);
        setCode(code);
    };

    const onPasswordSet = () => {
        message.success('Password changed. You may login using new credentials.');
        history.push('/login');
    };

    return <div className='auth-wrapper'>
        <div className={'login-wrapper'}>
            <div className={'login-form-wrapper'}>
                {!passwordResetRequestSent && !codeIsValid &&
                <ForgotPasswordForm onPasswordResetRequest={onPasswordResetRequest}/>}

                {passwordResetRequestSent && !codeIsValid &&
                <ValidatePasswordResetRequestForm onValidCode={onValidCode}/>}

                {codeIsValid && <SetPasswordForm code={code} onPasswordSet={onPasswordSet}/>}

                <Link to={'/login'}>Login</Link>
            </div>
        </div>
    </div>;
}