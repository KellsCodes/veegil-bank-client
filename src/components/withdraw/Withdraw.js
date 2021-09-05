import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { withdraw } from '../../API/api';

import './style.css';
const initial_value = { amount: "", account_number: "" };

const Withdraw = ({ user, setUser, serverMessage, pathname, setPathname }) => {
    const history = useHistory();
    const [data_input, set_data_input] = useState(initial_value);
    const [show_dialogue_box, set_show_dialogue_box] = useState(false);
    const [activate_button, set_activate_button] = useState(false);
    const [message, setMessage] = useState(null);
    const [spinner, setSpinner] = useState(false);
    const [toggleBtn, setToggleBtn] = useState(false);

    // handle input change
    const handleInputChange = e => {
        if (e.target.type === "number") {
            if (e.target.value < 0 || !Number(e.target.value)) set_data_input({ [e.target.name]: '' })
            else {
                set_data_input({ ...data_input, [e.target.name]: e.target.value });
            }
        } else {
            set_data_input({ ...data_input, [e.target.name]: e.target.value });
        }
        serverMessage.set_server_success_message("")
    }

    // handle form submission
    const handleFormSubmission = e => {
        e.preventDefault();
        set_show_dialogue_box(true);
        serverMessage.set_server_success_message("")
    }

    // handle dialogue box continue button
    const handleContinueButton = async () => {
        setSpinner(true);
        const { data } = await withdraw(data_input);
        if (data) {
            setSpinner(false)
            setMessage(data.message);
            serverMessage.set_server_success_message("")
            set_show_dialogue_box(false);
            set_data_input(initial_value);
            if (data.success) {
                setUser({ ...user, balance: data.userBalance })
                // set message to display to user
                // set the response message from server
                serverMessage.set_server_success_message(data.message);
            }
        }
    }

    useEffect(() => {
        if (!data_input.amount) set_activate_button(false)
        else set_activate_button(true);
    }, [data_input])

    // dialogue box to confirm transaction
    const confirmBox = () => {
        return (
            <div className='card confirm-box'>
                <p>Dear {user && user.firstname},</p>
                <p>You want to withdraw &#8358;{data_input.amount} {data_input.account_number ? " from " + data_input.account_number + "." : "from your account."}</p>
                <p>Click on continue to carry on with the transaction</p>
                <div className="btn-group">
                    <button className='btn btn-danger close-btn' disabled={spinner && true} onClick={closeDialogueBox}>Close</button>
                    <button className='btn btn-primary continue-btn' disabled={spinner && true} onClick={handleContinueButton}>Continue</button>
                </div>
            </div>
        )
    }

    // handle close dialogue box
    const closeDialogueBox = () => {
        set_show_dialogue_box(false);
    }

    // toggle button handler
    const toggle = () => {
        setToggleBtn(!toggleBtn);
    }

    // clear server message if there is any when component mounts
    useEffect(() => {
        // i want to check if pathname is equal to the pathname receiving and updating message from server
        if ((pathname === "/user/transfer" || pathname === "/user/deposit") && serverMessage.server_success_message) {
            // reset the server success message to null to stop the message from displaying 
            serverMessage.set_server_success_message("");
            // update the pathname to keep track of page location to make decision on the server success message
            setPathname(history.location.pathname);
        } else {
            setPathname(history.location.pathname);
        }
    }, []);

    return (
        <div className='container'>
            <div className="admin_statement_decision">
                {/* this div enables an admin to check for account holder history, this button is disabled for non admin account holders */
                    user?.admin_user && (<div>
                        <h6>Admin, you can also withdraw for non-admin account holder.</h6>
                        <p>Click the button below to toggle right and display input field</p>
                        <p>This is where you enter users account number for withdrawal</p>
                        <div className="check_statement_of_account_toggle">
                            <div className={`toggle_btn ${toggleBtn ? "toggle" : ""}`} onClick={toggle} ></div>
                        </div>
                    </div>)
                }
            </div>

            <form className='withdrawal-form' onSubmit={handleFormSubmission}>
                {
                    // display only for admins and togglebtn is on
                    toggleBtn && (
                        <div className="mb-3">
                            <label htmlFor="amount" className="form-label">Account number</label>
                            <input value={initial_value.account_number} type="text" name='account_number' className="form-control" placeholder='users account number' value={data_input.account_number} onChange={handleInputChange} />
                        </div>
                    )
                }
                <div className="mb-3">
                    <label htmlFor="amount" className="form-label">Amount</label>
                    <input value={initial_value.amount} type="number" name='amount' className="form-control" placeholder='0' value={data_input.amount} onChange={handleInputChange} />
                </div>

                <button type="submit" className="btn btn-primary withdraw-btn" disabled={activate_button ? false : true}>Withdraw</button>
                <br />
                {
                    // success message when withdrawal is complete
                    (<div className='withdraw-amount'>{message ? message : ""}</div>)
                }
                {
                    // server success message from parent component, this is to solve problem of component rerendering
                    serverMessage.server_success_message && (<div className='text-success'>{serverMessage.server_success_message}</div>)
                }
            </form>
            <br />
            {
                spinner && (<div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>)
            }
            <div className='confirm-box-container'>
                {show_dialogue_box ? confirmBox() : null}
            </div>
        </div>
    )
}

export default Withdraw;