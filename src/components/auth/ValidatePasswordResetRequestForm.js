import React, {useState, useContext} from 'react';

import {Form, Button, Input} from 'antd';

import {AuthContext} from '../../contexts/auth/AuthContext';
import {validationMessages} from '../../components/forms/common';


const ValidatePasswordResetRequestForm = (props) => {
    const {onValidCode} = props;
    const {getFieldDecorator, setFields} = props.form;
    const authContext = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();

        props.form.validateFields((err, values) => {
            if (!err) {
                setIsSubmitting(true);

                authContext.actions.validatePasswordResetRequest(values.code, {
                    onSuccess: () => {
                        setIsSubmitting(false);
                        onValidCode(values.code);
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
                {getFieldDecorator('code', {
                    rules: [{required: true, message: validationMessages.required}],
                })(
                    <Input autoComplete={'off'}
                           placeholder='Verification code'/>
                )}
            </Form.Item>
            <Form.Item>
                <Button type='primary'
                        loading={isSubmitting}
                        size={'large'}
                        htmlType='submit'
                        className='auth-form-button'>
                    Verify code
                </Button>
            </Form.Item>
        </Form>
    </div>;
};

export default Form.create()(ValidatePasswordResetRequestForm);

