import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../API/api';

import './style.css'

// initial values before input
const initialValues = { firstname: "", lastname: "", email: "", confirm_email: "", phone_number: "", password: "", confirm_password: "", admin_user: false, pledge_accuracy: "" };
const Signup = () => {
    const [inputData, setInputData] = useState(initialValues); //set initial values of input
    const [activate_submit_button, set_activate_submit_button] = useState(false); // keeps the submission button active or inactive
    const [password_check, set_password_check] = useState(false); // to confirm input passwords
    const [email_check, set_email_check] = useState(false);  // to compare input emails
    const [warning_message, set_warning_messsage] = useState(null);  //activates or deactivates warning messages
    const [spinner, setSpinner] = useState(false);
    const [signup_success, setSignup_success] = useState(false);

    const handleInputChange = e => {
        const target = e.target;
        const value = target.type === "checkbox" ? target.checked : target.value; // get input values or check values
        const name = target.name;
        setInputData({ ...inputData, [name]: value });
        setSignup_success(false);
    };

    // check box uncheck handler
    const checkProps = ["pledge_accuracy", "admin_user"]
    const uncheck = (checkedProps) => {
        let i = 0;
        while (i < checkedProps.length) {
            if (document.getElementById(checkedProps[i]).checked) {
                document.getElementById(checkedProps[i]).checked = false;
            }
            ++i
        }
    }

    // handle form data submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // activate warning message if fields are not correct
        if (email_check || password_check) return set_warning_messsage("Please make sure your entries are matching!")
        else {
            setSpinner(true);
            set_warning_messsage(null);
            setSignup_success(false);
            const { data } = await api.createUser(inputData);
            if (data) {
                setSpinner(false)
                set_warning_messsage(data.message);
                // check the message received if sign up was successful
                if (data.message === "Signed up successfully") {
                    setInputData(initialValues);
                    set_activate_submit_button(false);
                    setSignup_success(true);
                    uncheck(checkProps);
                }
            }
        }

    }

    useEffect(() => {
        // check if the fileds have been properly supplied with values
        const dataKeys = Object.keys(inputData).filter(value => value !== "admin_user");
        const length_of_value = dataKeys.length;
        let count = 0;
        for (let i = 0; i < dataKeys.length; ++i) {
            if (inputData[dataKeys[i]]) count++
        }
        // check if the count is equal to the input fields containing actual values, set the activate button
        if (count === length_of_value) set_activate_submit_button(true)
        else set_activate_submit_button(false);

        // check if the password inputs are thesame
        if (inputData.password && inputData.confirm_password)
            if (inputData.confirm_password !== inputData.password) set_password_check(true)
            else set_password_check(false);

        // check if email inputs are the same
        if (inputData.email && inputData.confirm_email)
            if (inputData.email !== inputData.confirm_email) set_email_check(true)
            else set_email_check(false);
    }, [inputData])
    return (
        <div className='sign-up container-fluid'>
            <form className='sign-up-form' onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="firstname" className="form-label">First name</label>
                    <input value={inputData.firstname} type="text" name='firstname' className="form-control" placeholder='enter your first name' onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="lastname" className="form-label">Last name</label>
                    <input value={inputData.lastname} type="text" name='lastname' className="form-control" placeholder='enter your last name' onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputEmail1" className="form-label">Email address</label>
                    <input value={inputData.email} type="email" name='email' className="form-control" placeholder='enter email' onChange={handleInputChange} required />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="inputEmail1" className="form-label">Confirm Email address</label>
                    <input value={inputData.confirm_email} type="email" name='confirm_email' className="form-control" placeholder='confirm email' onChange={handleInputChange} required />
                    {
                        // check if email are thesame
                        email_check && (<div id='email_match'>Email do not match</div>)
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="phone_number" className="form-label">Phone number</label>
                    <input value={inputData.phone_number} type="text" className="form-control" name="phone_number" placeholder='enter phone number' onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="lastname" className="form-label">Password</label>
                    <input value={inputData.password} type="password" name='password' className="form-control" placeholder='enter password' onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="lastname" className="form-label">Confirm Password</label>
                    <input value={inputData.confirm_password} type="password" name='confirm_password' className="form-control" placeholder='confirm password' onChange={handleInputChange} required />
                    {
                        // check if passwords match
                        password_check && (<div id="password_match" className="form-text">Password do not match</div>)
                    }

                </div>
                <div className="mb-3 form-check">
                    <input value={inputData.admin_user} type="checkbox" className="form-check-input" id='admin_user' name="admin_user" onChange={handleInputChange} />
                    <label className="form-check-label" htmlFor="admin_user">Admin user? This is not compulsory, only for admin accounts</label>
                </div>
                <div className="mb-3 form-check">
                    <input value={inputData.pledge_accuracy} type="checkbox" className="form-check-input" id='pledge_accuracy' name="pledge_accuracy" onChange={handleInputChange} />
                    <label className="form-check-label" htmlFor="pledge_acuracy">Pledge accuracy</label>
                </div>
                <button type="submit" disabled={activate_submit_button ? false : true} className="btn btn-success btn-signup">Sign up</button>
                {
                    // display error or success messages
                    warning_message && (<div className={signup_success ? "text-success" : "warning"}>{signup_success ? (<span>{warning_message}. <Link to='/signin'>Please sign in </Link> to continue</span>) : warning_message}</div>)
                }
                <br />
                {
                    spinner && (<div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>)
                }
                <div className='signup_div'>
                    <span className='decoration_line'></span>
                    <span className='decoration_text'>or</span>
                    <span className='decoration_line'></span>
                </div>
                <div>Have an account? <Link to='/signin'>Sign in</Link></div>
            </form>
            <div className='brand-description sign-up-container'>
                <h1>Veegil.</h1>
                <p>Banking with Better Experience!</p>
            </div>
        </div>
    )
}

export default Signup;