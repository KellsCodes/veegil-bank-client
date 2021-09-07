import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { authenticatedUser } from './API/api';

// make default api call
async function validDateUser() {
    let userObject;
    const response_payload = await authenticatedUser();
    // check if meet was unable to get response payload
    if (!response_payload) {
        // meaning that the request payload is undefined, exit the function
        return
    } else {
        // there is a response payload from server
        const { data } = response_payload;
        if (data) {
            // set the user object with data from response payload
            userObject = data.user
        }
    }
    return userObject
}

const userObject = validDateUser();
if(userObject) console.log(userObject)

ReactDOM.render(
    <App userObject={userObject} />,
    document.getElementById('root')
);

