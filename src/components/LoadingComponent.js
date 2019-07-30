import React from 'react';

import {Alert} from 'antd';

import LoadingProgress from './LoadingProgress';

export const LoadingComponent = ({isLoading, error}) => {
    if (isLoading) {
        return <LoadingProgress/>;
    } else if (error) {
        console.error(error);
        return <Alert type={'error'} showIcon={true} message={'Can not load requested page. Please try again later'}/>;
    } else {
        return null;
    }
};