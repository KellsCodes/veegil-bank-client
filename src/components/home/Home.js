import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const Home = ({props}) => {
    
    return (
        <div className='container home-set-up'>
            <h1>Welcome to Veegil Banking Inc.</h1>
            <p>Experience banking with a difference, {
                !props.user ? (<span><Link to='/signup'>continue here</Link></span>) : (<span>lots more!</span>)
            }
            </p>
        </div>
    )
}

export default Home;