import React, { useState, useEffect } from "react";
import { getUsers, delete_a_user } from "../../API/api";
// import { FontAwesome } from 

import "./style.css";

const Manage_users = ({ admin }) => {
    const [spinner, setSpinner] = useState(false);
    const [currentUsers, setCurrentUsers] = useState(false);
    const [message, setMessage] = useState("");
    const [showDialogueBox, setShowDialogueBox] = useState(false);
    const [currentUserToDelete, setCurrentUserToDelete] = useState("")

    // handle delete action of a user no longer needed
    const deleteUser = () => { setShowDialogueBox(true) }

    // handle close dialogue button
    const closeDialogueBox = () => { setShowDialogueBox(false) };

    // handle proceed to delete action
    const handleContinueButton = async () => {
        // send user id to server to verify
        setSpinner(true);
        setMessage("");
        const { data } = await delete_a_user(currentUserToDelete._id);
        // check if deletion was successful to update client users display
        if (data) {
            setSpinner(false);
            setMessage(data.message);
            setShowDialogueBox(false);
            if(data.success){
                // filter out the deleted user from the current users array
                setCurrentUsers(currentUsers.filter(user => user._id !== currentUserToDelete._id))
                setCurrentUserToDelete("") // set current user to delete to null
            }
        }
    };

    // select user controller
    const setUserToDelete = user => {
        setCurrentUserToDelete(user)
        setShowDialogueBox(true);
    }

    // dialogue box before deleting
    const confirmBox = () => {
        return (
            <div className='card confirm-box'>
                <p>You are about deleting <span className="text-primary">{currentUserToDelete.name}</span></p>
                <p>You understand this action is irreversible!</p>
                <p>Click on continue to delete user</p>
                <div className="btn-group">
                    <button className='btn btn-danger close-btn' disabled={spinner && true} onClick={closeDialogueBox}>Close</button>
                    <button className='btn btn-primary continue-btn' disabled={spinner && true} onClick={handleContinueButton}>Continue</button>
                </div>
                <br /><br />
                {
                    spinner && (<div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>)
                }
            </div>
        )
    }

    // fetch data after component mounts
    useEffect(async () => {
        setSpinner(true)
        const { data } = await getUsers();
        if (data)
            if (!data.message) {
                setSpinner(false);
                setCurrentUsers(data.users);
            }
            else {
                setMessage(data.message)
            }
    }, [])

    // cycle thru each user object to get their details to display
    const user = currentUsers.length ? currentUsers.map((currentUser, index) => {
        return (
            <tbody key={currentUser._id}>
                <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{currentUser.name}</td>
                    <td>{currentUser.account_number}</td>
                    <td>&#8358;{currentUser.balance}</td>
                    <td><button disabled={showDialogueBox && true} onClick={() => setUserToDelete(currentUser)} className="btn btn-danger">Del</button></td>
                </tr>
            </tbody>
        )
    }) : null;
    return (
        <div className="container">
            <h2>Welcome {(admin && admin.admin_user) && admin.firstname}, you are an admin</h2>
            <div className="card">
                <div className="card-body">
                    <table className="table table-dark table-striped">
                        <thead>
                            <tr>
                                <th scope="col">S/n</th>
                                <th scope="col">Name</th>
                                <th scope="col">Acc Number</th>
                                <th scope="col">Balance</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        {user}
                    </table>
                </div>
                <br />
                {
                    spinner && (<div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>)
                }
                {message && (<div className="text-primary center">{message}</div>)}
            </div>
            { showDialogueBox && confirmBox()}
        </div>
    )
};

export default Manage_users;