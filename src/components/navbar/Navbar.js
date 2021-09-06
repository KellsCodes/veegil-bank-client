import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as api from '../../API/api';

import './style.css';

const Navbar = ({userProp, setUser}) => {
    const history = useHistory();
    // handle user unauthentication
    const signOut = async () => {
        const { data } = await api.logoutUser();
        if(data.success) {
            console.log(data.user);
            setUser(data.user)
            history.push("/signin");
            // const windowLocation = window.location.reload();  //forces reload on browser to clear cache and store values
        }
    }
    return (
        <header>
            <div className='top-header'>
                <a className="navbar-brand brand" href="/">Veegil Inc.</a>
                <div className='header-contents'>
                    <div className='left-nav'>
                        <Link className="home-link" to="/">Home</Link>
                        {
                            // only display balance when a user is authenticated and logged in
                            (userProp && userProp.balance) && (<span> Balance: &#8358;{userProp.balance}</span>)
                        }
                    </div>
                    {
                        // check if a user exist to disable sign in button
                        !userProp ? (<button className='btn btn-primary'><Link to='/signin'>Sign in</Link></button>) : (
                            <div className='user-settings'>
                                <div className='action-area'>
                                    <span>{userProp.firstname[0]}</span>
                                    <button className='btn btn-light' onClick={signOut}>Sign out</button>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            {
                // check if a user exists before displaying the action nav links
                userProp && (
                    <nav className="navbar navbar-expand-lg navbar-light bg-light nav-color">
                        <div className="container-fluid">
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                                <div className="navbar-nav">
                                    {
                                        // only admins can make deposits to users according to users cash at hand
                                        (userProp && userProp.admin_user) && (<Link className="nav-link active" to="/user/deposit">Deposit</Link>)
                                    }
                                    <Link className="nav-link active" to="/user/withdraw" >Withdraw</Link>
                                    <Link className="nav-link active" to="/user/transfer" >Transfer</Link>
                                    <div className="nav-item dropdown">
                                        <Link className="nav-link active dropdown-toggle" to="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            History
                                        </Link>
                                        <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                                            <li><Link className="dropdown-item" to="/history/transactions">All transactions History</Link></li>
                                            <li><Link className="dropdown-item" to="/history/deposits">Deposits History</Link></li>
                                            <li><Link className="dropdown-item" to="/history/withdrawals">Withdrawals History</Link></li>
                                            <li><Link className="dropdown-item" to="/history/transfers">Transfers History</Link></li>
                                        </ul>
                                    </div>
                                    {
                                        /* check if the user is an admin to display the manage users link */
                                        (userProp && userProp.admin_user) && (<Link className='nav-link active' to='/admin/users/manage'>Manage users</Link>)
                                    }

                                </div>
                            </div>
                        </div>
                    </nav>
                )
            }
        </header>
    )
}

export default Navbar;