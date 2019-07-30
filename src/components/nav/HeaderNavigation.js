import React, {useContext} from 'react';
import {Link, withRouter} from 'react-router-dom';

import {Menu, Icon} from 'antd';

import {AuthContext} from '../../contexts/auth/AuthContext';


const HeaderNavigation = (props) => {
    const {location} = props;
    const authContext = useContext(AuthContext);
    const user = authContext.state;

    let selectedPathName = '';
    let pathNameParts = location.pathname.split('/');

    if (pathNameParts.length >= 2) {
        selectedPathName = `/${pathNameParts[1]}`;
    }

    return <Menu mode='horizontal'
                 style={{float: 'right'}}
                 selectedKeys={[selectedPathName]}>
        <Menu.SubMenu title={<span className='submenu-title-wrapper'>
                    <Icon type='user'
                          theme='outlined'/>{user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}</span>}>
            <Menu.Item key={'/logout'}>
                <Link to='/logout'>Logout</Link>
            </Menu.Item>
        </Menu.SubMenu>
    </Menu>;
};

export default withRouter(HeaderNavigation);
