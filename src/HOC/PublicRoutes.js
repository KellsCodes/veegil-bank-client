import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PublicRoutes = ({component: Component, user, ...rest}) => {
    return (
        <Route {...rest} render={props => {
            // check if user is not authenticated yet
            if(user) {
                return <Redirect to={{pathname: "/", state: {from: props.location}}} />
            }
            // otherwise return the user to the right page for authentication
            return <Component {...props} />
        }} />
    )
}

export default PublicRoutes;