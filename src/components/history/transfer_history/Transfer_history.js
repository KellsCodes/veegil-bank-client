import React, { useEffect, useState } from 'react';

// import "./style.css";
import History_action from "../general_action/action";
import History from "../general_action/History";

const Transaction_history = ({user}) => {
    const [history, setHistory] = useState([]);
    const [account_holder_name, set_acc_holder_name] = useState("");
    return (
        <div className="container-fluid transfer-history history">
            <History_action button_name="Check transactions" type="transfers" setHistory={setHistory} user={user} set_acc_holder_name={set_acc_holder_name} />
            <History history={history} type="transfers" user={user} name={account_holder_name} />
        </div>
    )
}

export default Transaction_history;