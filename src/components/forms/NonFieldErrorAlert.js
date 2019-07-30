import React from 'react';

import {Alert} from 'antd';


export default class NonFieldErrorAlert extends React.Component {
    render = () => {
        const {errors} = this.props;

        return (
            <div>
                {errors && errors.non_field_errors && errors.non_field_errors.length > 0 &&
                <Alert message={errors.non_field_errors.join(', ')} type='error' showIcon/>}
            </div>
        )
    }
}
