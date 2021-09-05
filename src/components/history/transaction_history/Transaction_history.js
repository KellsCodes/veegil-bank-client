import React, { useEffect, useState } from 'react';

import "./style.css";
import History_action from "../general_action/action";
import History from "../general_action/History";

const Transaction_history = ({user}) => {
    const [history, setHistory] = useState([]);
    const [account_holder_name, set_acc_holder_name] = useState("");
    return (
        <div className="container-fluid transaction-history history">
            <History_action button_name="Check transactions" type="transactions" setHistory={setHistory} user={user} set_acc_holder_name={set_acc_holder_name} />
            {/* <div className="view-deposit-history">view transactions here</div> */}
            <History history={history} type="transactions" user={user} name={account_holder_name} />
        </div>
    )
}

export default Transaction_history;