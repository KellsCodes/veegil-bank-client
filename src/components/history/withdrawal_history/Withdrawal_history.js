import React, {useState} from "react";

import "./style.css";
import History_action from "../general_action/action";
import History from "../general_action/History";

const Withdrawal_history = ({user}) => {
    const [history, setHistory] = useState([]);
    const [account_holder_name, set_acc_holder_name] = useState("");
    return (
        <div className="container-fluid withdrawal-history history">
            <History_action button_name="Check withdrawals" type="withdrawals" setHistory={setHistory} user={user} set_acc_holder_name={set_acc_holder_name} />
            {/* <div className="view-deposit-history"><></div> */}
            <History history={history} type="withdrawals" user={user} name={account_holder_name} />
        </div>
    )
}

export default Withdrawal_history;