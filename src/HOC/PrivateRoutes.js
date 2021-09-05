import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoutes = ({component: Component, user, role, ...rest}) => {
    return (
        <Route {...rest} render={props => {
            // check if user is not authenticated yet
            if(!user) {
                return <Redirect to={{pathname: "/signin", state: {from: props.location}}} />
            }
            // check if user is not an admin to protect the admin route only
            if(!role.includes(user.admin_user)) {
                return <Redirect to={{pathname: "/", state: {from: props.location}}} />
            }
            // otherwise return the user to the right page
            return <Component {...props} />
        }} />
    )
}

export default PrivateRoutes;