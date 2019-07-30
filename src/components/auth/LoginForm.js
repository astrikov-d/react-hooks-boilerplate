import React, {useState, useContext} from 'react';

import {Form, Button, Input} from 'antd';

import NonFieldErrorAlert from '../../components/forms/NonFieldErrorAlert';
import {AuthContext} from '../../contexts/auth/AuthContext';
import {validationMessages} from '../../components/forms/common';


const LoginForm = (props) => {
    const {getFieldDecorator} = props.form;
    const authContext = useContext(AuthContext);
    const {onSubmit} = props;

    const [loginErrors, setLoginErrors] = useState(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                setIsSubmitting(true);
                setLoginErrors(undefined);

                authContext.actions.login(values, {
                    onSuccess: (params) => {
                        setIsSubmitting(false);
                        onSubmit(values.username, values.password);
                    },
                    onError: (params) => {
                        setIsSubmitting(false);
                        setLoginErrors(params.errors);
                    }
                });
            }
        });
    };

    return <div>
        <NonFieldErrorAlert errors={loginErrors}/>
        <Form onSubmit={handleSubmit} className='login-form' autoComplete={'off'}>
            <Form.Item>
                {getFieldDecorator('username', {
                    rules: [{required: true, message: validationMessages.required}],
                })(
                    <Input autoComplete={'off'}
                           placeholder='Username'/>
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('password', {
                    rules: [{required: true, message: validationMessages.required}],
                })(
                    <Input type='password'
                           autoComplete={'new-password'}
                           placeholder='Password'/>
                )}
            </Form.Item>
            <Form.Item>
                <Button type='primary'
                        loading={isSubmitting}
                        size={'large'}
                        htmlType='submit'
                        className='auth-form-button'>
                    Login
                </Button>
            </Form.Item>
        </Form>
    </div>;
};

export default Form.create()(LoginForm);

