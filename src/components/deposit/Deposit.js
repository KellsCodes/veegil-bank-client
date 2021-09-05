import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as api from '../../API/api';

import './style.css';

const initialValues = { nameOfDepositor: "", recipient_account_number: "", amount: 0 };

const Deposit = ({ user, setUser, serverMessage, pathname, setPathname }) => {
    const history = useHistory();
    const [success_message, set_success_message] = useState("");
    const [data_inputs, set_data_inputs] = useState(initialValues);
    const [err_message, set_err_message] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [self, set_Self] = useState(false);

    console.log(serverMessage.server_success_message);

    // handle input field
    const handleInputChange = e => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        if (target.type === "number") {
            if (value < 0) {
                set_data_inputs({ ...data_inputs, [name]: 0 })
            } else {
                set_data_inputs({ ...data_inputs, [name]: value })
            }
        } else {
            set_data_inputs({ ...data_inputs, [name]: value })
        }
        set_success_message(""); //reset success message when user is typing
        set_err_message(false)
        serverMessage.set_server_success_message("")
    }

    // handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        set_success_message(null) //reset warning message when user tries to submit form data
        serverMessage.set_server_success_message("")
        // set_err_message(false)
        if (!data_inputs.nameOfDepositor || data_inputs.amount <= 0 || !data_inputs.recipient_account_number) {
            return set_err_message(true);
        } else {
            set_err_message(false)
        }
        setSpinner(true);
        const { data } = await api.deposit(data_inputs);
        // check if transfer was successful
        if (data) {
            setSpinner(false);
            console.log(data)
            set_success_message(data.message);
            set_data_inputs(initialValues);
            // check if the account number input is correct to return the correct details of user
            if (data.self) {
                setUser({ ...user, balance: data.userBalance });
                set_Self(true);
                serverMessage.set_server_success_message(data.message);
            }
        }

    }
    // console.log(pathname)

    useEffect(() => {
            // i want to check if pathname is equal to the pathname receiving and updating message from server
            if ((pathname === "/user/withdraw" || pathname === "/user/transfer") && serverMessage.server_success_message) {
                // reset the server success message to null to stop the message from displaying 
                serverMessage.set_server_success_message("");
                // update the pathname to keep track of page location to make decision on the server success message
                setPathname(history.location.pathname);
            } else  {
                setPathname(history.location.pathname);
            }
    }, []);

    return (
        <div className='container-fluid'>
            <h1>Welcome, {user ? `${user.firstname}` : "user"}!</h1>
            <form className='deposit-form' onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nameOfDepositor" className="form-label">Name of Depositor</label>
                    <input value={data_inputs.nameOfDepositor} type="text" name='nameOfDepositor' className="form-control" placeholder='enter depositors name' value={data_inputs.nameOfDepositor} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="recipient_account_number" className="form-label">Recipient account number</label>
                    <input value={data_inputs.recipient_account_number} type="text" name='recipient_account_number' className="form-control" placeholder='enter recipients account number' value={data_inputs.recipient_account_number} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="amount" className="form-label">Enter amount</label>
                    <input value={data_inputs.amount} type="number" name='amount' className="form-control" placeholder='0' value={data_inputs.amount} onChange={handleInputChange} />
                </div>
                <button type="submit" className="btn btn-primary">Deposit</button>
                {
                    err_message && (<div className="deposit-warning">Please fill the form. Amount should be greater than 0</div>)
                }
                <br /><br />
                {
                    // server success message from parent component, this is to solve problem of component rerendering
                    serverMessage.server_success_message && (<div className='text-success'>{serverMessage.server_success_message}</div>)
                }
                {
                    spinner && (<div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>)
                }
                {
                    // success message when deposit is complete
                    (success_message) ? (<div className='deposit-transfer'>{success_message}</div>) : (<div className='deposit-transfer'>{success_message}</div>)
                }

            </form>
        </div>
    )
}

export default Deposit;