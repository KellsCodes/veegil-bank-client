import React, { useEffect, useState } from 'react';
import { history } from "../../../API/api"

import "./style.css";

const History_action = (props) => {
    const initialValues = { starting_date: "", ending_date: "", user_account_number: "", type: props.type }
    // set values for transactions
    const [data_inputs, set_data_inputs] = useState(initialValues);
    const [activate_button, set_activate_button] = useState(false);
    const [message, set_message] = useState(null);
    const [spinner, setSpinner] = useState(false);
    const [toggleBtn, setToggleBtn] = useState(false);

    // handle input values
    const handleDataInput = e => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        set_data_inputs({ ...data_inputs, [name]: value });
    };

    // handle form submission
    const handleFormSubmission = async (e) => {
        e.preventDefault();
        // console.log(props.setHistory)
        setSpinner(true)
        set_message(null);
        // clear input account number from previous input for a user account statement
        if (!toggleBtn) {
            data_inputs.user_account_number = "";
        }
        // console.log(data_inputs);
        const { data } = await history(data_inputs);
        if (data) {
            setSpinner(false);
            // check if there was no history delivered in case for a user with no transaction records yet
            if (data.message || !data.historySuccess) return set_message(data.message);
            // otherwise pass the history data to the component
            const { transactions, name } = data;
            props.setHistory(transactions);
            props.set_acc_holder_name(name);
        }
    }

    // toggle button handler
    const toggle = () => {
        setToggleBtn(!toggleBtn)
        if (!toggleBtn) {
            set_data_inputs({ ...data_inputs, user_account_number: "" });
        }
    }

    return (
        <div className="card action_card">
            <div className="admin_statement_decision">
                {/* this div enables an admin to check for account holder history, this button is disabled for non admin account holders */
                    props.user?.admin_user && (<div>
                        <h6>Admin can also check for a non-admin account holder.</h6>
                        <div className="check_statement_of_account_toggle">
                            <div className={`toggle_btn ${toggleBtn ? "toggle" : ""}`} onClick={toggle} ></div>
                        </div>
                    </div>)
                }
            </div>
            <form onSubmit={handleFormSubmission}>
                {
                    // admin to enter account number of the user he wants to check the statements
                    toggleBtn && (<div>
                        <label htmlFor="user_account_number">User account number:</label><br />
                        <input type="text" name="user_account_number" value={data_inputs.user_account_number} onChange={handleDataInput} placeholder='enter account number' />
                    </div>)
                }
                <label htmlFor="date">From:</label> <br />
                <input type="date" id="from_date" name="starting_date" value={data_inputs.starting_date} onChange={handleDataInput} /> <br />

                <label htmlFor="date">To:</label> <br />
                <input type="date" id="to_date" name="ending_date" value={data_inputs.ending_date} onChange={handleDataInput} /><br />
                <button className='btn btn-primary history-btn' >{props.button_name}</button>
            </form>
            {
                spinner && (<div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>)
            }
            {
                // display error messages
                message && (<div className='text-danger'>{message}</div>)
            }

        </div>
    )
}

export default History_action;