import React, { useState } from 'react';

import './style.css';
import History_action from '../general_action/action';
import History from "../general_action/History";

const Deposit_history = ({user}) => {
    const [history, setHistory] = useState([]);
    const [account_holder_name, set_acc_holder_name] = useState("");
    return (
        <div className="container-fluid deposit-history history">
            <History_action button_name="Check Deposits" type="deposits" setHistory={setHistory} user={user} set_acc_holder_name={set_acc_holder_name} />
            {/* <div className="view-deposit-history">view result here</div> */}
            <History history={history} type="deposits" user={user} name={account_holder_name} />
        </div>
    )
}

export default Deposit_history;