import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as api from '../../API/api';

import './style.css'

// initial values
const initial_values = {email: "", password: ""};

const Signin = ({setUser}) => {
    // check for inputs errors
    const [input_data, set_input_data] = useState(initial_values);
    const [activate_button, set_activate_button] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [message, setMessage] = useState(null);
    const history = useHistory();

    // handle input change
    const handleInputChange = e => {
        const target = e.target;
        const name = target.name;
        const value = target.value
        set_input_data({...input_data, [name]: value});
        setMessage(null);
    }

    // handle submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSpinner(true);
        setMessage(null);
        const response = await api.signInUser(input_data);
        console.log(response)
        // check if user login was successful
        const { data } = response;
        console.log(data)
        if(data) {
            setSpinner(false);
            if(data.user) {
                // cookies.set('token', data.token, options);
                // document.cookie = `token_key=${data.token}; path=/`
                setUser(data.user);
                set_input_data(initial_values);
                history.push("/")
            }
            // check if error occurred
            if(data.message){
                setMessage(data.message);
            }
        }
        // console.log(input_data);
    }

    useEffect(() => {
        // check if the fields are empty to deactivate the button
        if (!input_data.email || !input_data.password) set_activate_button(true)
        else set_activate_button(false);
    }, [input_data])

    return (
        <div className='sign-in container-fluid'>
            <form className='sign-in-form' onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="inputEmail1" className="form-label">Email address</label>
                    <input value={input_data.email} type="email" name='email' className="form-control" required onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="lastname" className="form-label">Password</label>
                    <input value={input_data.password} type="password" name='password' className="form-control" placeholder='enter password' required onChange={handleInputChange} />
                </div>
                <button type="submit" className="btn btn-primary btn-signin" disabled={activate_button ? true : false}>Sign in</button><br />
                {
                    message && (<div className="err">{message}</div>)
                }
                <br />
                {
                    spinner && (<div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>)
                }
                <div className='signup_div'>
                    <span className='decoration_line'></span>
                    <span className='decoration_text'>or</span>
                    <span className='decoration_line'></span>
                </div>
                <div>Don't have an account? <Link to='/signup'>Sign up</Link></div>
                
            </form>
            <div className='brand-description'>
                <h1>Veegil.</h1>
                <p>Banking with Better Experience!</p>
            </div>
        </div>
    )
}

export default Signin;