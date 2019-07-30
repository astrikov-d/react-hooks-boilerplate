import React, {useState, useContext} from 'react';

import {Form, Button, Input} from 'antd';

import {AuthContext} from '../../contexts/auth/AuthContext';
import {validationMessages} from '../../components/forms/common';


const SetPasswordForm = (props) => {
    const {onPasswordSet, code} = props;
    const {getFieldDecorator, setFields, getFieldValue, validateFields} = props.form;
    const authContext = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                setIsSubmitting(true);

                authContext.actions.setUserPassword(code, values.password, {
                    onSuccess: () => {
                        setIsSubmitting(false);
                        onPasswordSet();
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

    const validateConfirmPassword = (rule, value, callback) => {
        if (!value || value === getFieldValue('password')) {
            callback();
        } else {
            callback(new Error('Passwords do not match'));
        }
    };

    const forceConfirmPasswordValidation = (rule, value, callback) => {
        if (getFieldValue('password_confirmation')) {
            validateFields(['password_confirmation'], {force: true});
        }
        callback();
    };

    return <div>
        <Form onSubmit={onSubmit} className='forgot-password-form' autoComplete={'off'}>
            <Form.Item label='Password'>
                {getFieldDecorator('password', {
                    rules: [
                        {required: true, message: validationMessages.required},
                        {validator: forceConfirmPasswordValidation}
                    ],
                })(
                    <Input autoComplete={'new-password'}
                           type='password'
                    />
                )}
            </Form.Item>

            <Form.Item label='Confirm password'>
                {getFieldDecorator('password_confirmation', {
                    rules: [
                        {required: true, message: validationMessages.required},
                        {validator: validateConfirmPassword}
                    ],
                })(
                    <Input autoComplete={'new-password'}
                           type='password'
                    />
                )}
            </Form.Item>
            <Form.Item>
                <Button type='primary'
                        loading={isSubmitting}
                        size={'large'}
                        htmlType='submit'
                        className='auth-form-button'>
                    Set password
                </Button>
            </Form.Item>
        </Form>
    </div>;
};

export default Form.create()(SetPasswordForm);

