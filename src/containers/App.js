import React, {useContext, useState, useEffect} from 'react';

import {Layout, Icon} from 'antd';

import {routes} from './../routes';
import {AuthContext} from '../contexts/auth/AuthContext';
import MainNavigation from '../components/nav/MainNavigation';
import HeaderNavigation from '../components/nav/HeaderNavigation';

const {Header, Content, Sider} = Layout;


const App = function () {
    const authContext = useContext(AuthContext);
    const [isSliderCollapsed, setIsSliderCollapsed] = useState(false);

    let router;

    const toggleSlider = () => {
        setIsSliderCollapsed(!isSliderCollapsed);
    };

    useEffect(() => {
        if (authContext.state.token) {
            authContext.actions.getCurrentUser();
        }
    }, []);

    if (authContext.state.token) {
        router = (
            <Layout>
                <Sider width={260}
                       trigger={null}
                       collapsible
                       collapsed={isSliderCollapsed}
                       style={{
                           overflow: 'hidden',
                           height: '100vh',
                           position: 'fixed',
                           left: 0,
                       }}>
                    <MainNavigation/>
                </Sider>
                <Layout style={{marginLeft: isSliderCollapsed ? 80 : 260}}>
                    <Header>
                        <Icon className='trigger'
                              type={isSliderCollapsed ? 'menu-unfold' : 'menu-fold'}
                              onClick={toggleSlider}
                        />
                        <HeaderNavigation/>
                    </Header>
                    <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
                        {routes}
                    </Content>
                </Layout>
            </Layout>
        )
    } else {
        router = (
            <div>
                {routes}
            </div>
        )
    }

    return router
};

export default App;
