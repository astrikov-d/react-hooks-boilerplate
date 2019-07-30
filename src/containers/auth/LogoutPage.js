import React, {useContext} from 'react';

import {Alert, Button, Icon} from 'antd';

import {AuthContext} from '../../contexts/auth/AuthContext';

export default function LogoutPage(props) {
    const authContext = useContext(AuthContext);

    const onLogout = () => {
        authContext.actions.logout({
            onSuccess: () => {
                props.history.push('/');
            }
        });
    };

    return <div>
        <Alert message={'Are you sure?'} type='warning' showIcon/>
        <div style={{marginTop: 10}}>
            <Button type='primary' onClick={onLogout}>
                <Icon type='check-circle'/> Logout
            </Button>
        </div>
    </div>;
}