import React, {useState, useContext} from 'react';

import {Form, Button, Input} from 'antd';

import {AuthContext} from '../../contexts/auth/AuthContext';
import {validationMessages} from '../../components/forms/common';


const ForgotPasswordForm = (props) => {
    const {onPasswordResetRequest} = props;
    const {getFieldDecorator, setFields} = props.form;
    const authContext = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                setIsSubmitting(true);

                authContext.actions.sendRestorePasswordEmail(values.email_or_username, {
                    onSuccess: () => {
                        setIsSubmitting(false);
                        onPasswordResetRequest();
                    },
                    onError: (errors) => {
                        setIsSubmitting(false);
                        Object.entries(errors.errors).forEach((error) => {
                            const [field, errors] = error;
                            setFields({
                                [field]: {
                                    value: values[field],
                                    errors: [new Error(errors)]
                                }
                            });
                        });
                    }
                });
            }
        });
    };

    return <div>
        <Form onSubmit={onSubmit} className='forgot-password-form' autoComplete={'off'}>
            <Form.Item>
                {getFieldDecorator('email_or_username', {
                    rules: [{required: true, message: validationMessages.required}],
                })(
                    <Input autoComplete={'off'}
                           placeholder='Username or email'/>
                )}
            </Form.Item>
            <Form.Item>
                <Button type='primary'
                        loading={isSubmitting}
                        size={'large'}
                        htmlType='submit'
                        className='auth-form-button'>
                    Restore password
                </Button>
            </Form.Item>
        </Form>
    </div>;
};

export default Form.create()(ForgotPasswordForm);

