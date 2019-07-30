import React, {useContext} from 'react';

import {AuthContext} from '../../contexts/auth/AuthContext';

export default function Dashboard(props) {
    const authContext = useContext(AuthContext);
    const user = authContext.state;

    return <div>
        Hello {user.username}!
    </div>;
}