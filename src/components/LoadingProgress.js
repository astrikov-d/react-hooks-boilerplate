import React from 'react';

import {Icon, Spin} from 'antd';

export default function LoadingProgress() {
    const icon = <Icon type="loading" style={{fontSize: 24}} spin/>;

    return (
        <div style={{width: '50px', margin: '40px auto', padding: '20px 0'}}>
            <Spin indicator={icon}/>
        </div>
    )
}

