import React, {useContext} from 'react';

import {withRouter, NavLink} from 'react-router-dom';
import {Menu, Icon} from 'antd';

import {AuthContext} from '../../contexts/auth/AuthContext';
import LoadingProgress from '../LoadingProgress';


const MainNavigation = (props) => {
    const {location} = props;
    const authContext = useContext(AuthContext);
    const user = authContext.state;

    let selectedPathName = '';
    let pathNameParts = location.pathname.split('/');

    if (pathNameParts.length >= 2) {
        selectedPathName = `/${pathNameParts[1]}`;
    }

    if (!user.user_type) {
        return <LoadingProgress/>;
    }

    return <Menu mode='inline'
                 theme='dark'
                 defaultSelectedKeys={['/']}
                 defaultOpenKeys={selectedPathName ? [selectedPathName] : undefined}
                 selectedKeys={[selectedPathName]}
                 style={{height: '100%', borderRight: 0}}>
        <Menu.Item key={'/'}>
            <NavLink to='/'>
                <Icon type='home' theme='outlined'/>
                <span>Dashboard</span>
            </NavLink>
        </Menu.Item>
    </Menu>;
};

export default withRouter(MainNavigation);
