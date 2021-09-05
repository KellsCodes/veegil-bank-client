import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import "./style.css";
import { transfer } from '../../API/api';

const initialValues = { amount: "", recipient_account_number: "" };

const Transfer = ({ user, setUser, serverMessage, pathname, setPathname }) => {
    const history = useHistory();
    const [data_inputs, set_data_inputs] = useState(initialValues);
    const [message, set_message] = useState("");
    const [spinner, setSpinner] = useState(false);
    const [show_dialogue_box, set_show_dialogue_box] = useState(false);
    const [active_button, set_active_button] = useState(false);
    const [err_message, set_err_message] = useState(false);


    // handle input change
    const handleInputChange = e => {
        // only allow input value for amount greater than 0
        if (e.target.type === "number") {
            if (e.target.value < 0 || !Number(e.target.value)) set_data_inputs({ ...data_inputs, [e.target.name]: '' })
        }
        set_data_inputs({ ...data_inputs, [e.target.name]: e.target.value });
        set_message("");
        serverMessage.set_server_success_message("")
    }

    // handle submit button
    const handleSubmit = async (e) => {
        e.preventDefault();
        // show dialogue box for further decision
        set_show_dialogue_box(true);
        serverMessage.set_server_success_message("")
    };

    // handle close dialogue box
    const closeDialogueBox = () => {
        set_show_dialogue_box(false);
    }

    // handle continue box
    const handleContinueButton = async () => {
        // make api call to make transfer
        setSpinner(true);
        set_message("");
        serverMessage.set_server_success_message("")
        const res = await transfer(data_inputs);
        if (res.status == 401 || !res) {
            console.log(res)
            const windowLocation = window.location.reload();  //forces reload on browser to clear cache and store values
        }
        const { data } = res;
        if (data) {
            setSpinner(false)
            set_message(data.message);
            set_show_dialogue_box(false);
            if (data.success) {
                setUser({ ...user, balance: data.userBalance })
                serverMessage.set_server_success_message(data.message)
            }
        }
    };


    // handle dialogue box
    const confirmBox = () => {
        return (
            <div className='card confirm-box'>
                <p>Dear {user && user.firstname},</p>
                <p>You are about to transfer &#8358;{data_inputs.amount} from your account</p>
                <p>to {data_inputs.recipient_account_number}</p>
                <p>Click on continue to make the transfer</p>
                <div className="btn-group">
                    <button className='btn btn-danger close-btn' disabled={spinner && true} onClick={closeDialogueBox}>Close</button>
                    <button className='btn btn-primary continue-btn' disabled={spinner && true} onClick={handleContinueButton}>Continue</button>
                </div>
            </div>
        )
    }

    // update component when user types into the input field
    useEffect(() => {
        if (data_inputs.recipient_account_number && data_inputs.amount) {
            set_err_message(false)
            return
        }
        else {
            set_err_message(true)
        }

    }, [data_inputs]);

    // clear server message if there is any when component mounts
    useEffect(() => {
        // i want to check if pathname is equal to the pathname receiving and updating message from server
        if ((pathname === "/user/withdraw" || pathname === "/user/deposit") && serverMessage.server_success_message) {
            // reset the server success message to null to stop the message from displaying 
            serverMessage.set_server_success_message("");
            // update the pathname to keep track of page location to make decision on the server success message
            setPathname(history.location.pathname);
        } else {
            setPathname(history.location.pathname);
        }
    }, []);

    // console.log(active_button);
    return (
        <div className='container-fluid'>
            <h1>Welcome, {user ? `${user.firstname}` : "user"}!</h1>
            <form className='transfer-form' onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="recipient_account_number" className="form-label">Recipient account number</label>
                    <input value={data_inputs.recipient_account_number} type="text" name='recipient_account_number' className="form-control" placeholder='enter recipients account number' value={data_inputs.recipient_account_number} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="amount" className="form-label">Enter amount</label>
                    <input value={data_inputs.amount} type="number" name='amount' className="form-control" placeholder='0' value={data_inputs.amount} onChange={handleInputChange} />
                </div>
                <button type="submit" className="btn btn-primary transfer-btn" disabled={err_message || spinner && true} >Transfer</button>
                {
                    (!message && err_message || serverMessage.server_success_message) && (<div className="transfer-warning warning">Please fill the form</div>)
                }
                {
                    message && (<div className="transfer-warning warning">{message}</div>)
                }
                {
                    serverMessage.server_success_message && (<div className="text-success">{serverMessage.server_success_message}</div>)
                }
                <br /><br />
                {
                    spinner && (<div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>)
                }
            </form>
            <div className='confirm-box-container'>
                {show_dialogue_box ? confirmBox() : null}
            </div>
        </div>
    )
}

export default Transfer;