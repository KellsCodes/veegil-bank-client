import React, { useState, useEffect } from 'react';

import "./style.css"

const History = ({ history, type, user, name }) => {

    const displayHistory = history.length ? history.map((item, index) => {
        const hour = Number(item.time.split("T")[1].split(".")[0].split(":")[0]) + 1;
        const min_sec = item.time.split("T")[1].split(".")[0].split(":");
        const time_format = hour < 10 ? "0" + hour + ":" + min_sec.slice(1).join(":") : hour+ ":" + min_sec.slice(1).join(":") 
        return (
            <tbody key={item._id}>
                <tr className='table-data'>
                    <th scope="row">{index + 1}</th>
                    <td>{item.time.split("T")[0]}</td>
                    <td>{time_format}</td>
                    <td>{item.transaction}</td>
                    <td>{item.type}</td>
                    <td>&#8358;{item.amount}</td>
                    {(type === "transactions" || type === "deposits") && <td>{item.nameOfDepositor ? item.nameOfDepositor : "--"}</td>}
                    {(type === "transactions" || type === "transfers") && <td>{item.recipient_account_number ? item.recipient_account_number : "--"}</td>}
                    {(type === "transactions" || type === "transfers") && <td>{item.account_holder_name ? item.account_holder_name : "--"}</td>}
                </tr>
            </tbody>
        )
    }) : null;
    
    return (
        <div className="view-deposit-history">
            {history.length ? <h5 className='text-success'>Statement of account for {history.length && name}!</h5> : null }
            {history.length ? <p className='history-warning-text text-danger'>This statement is best viewed in a large screen</p> : null}
            {history.length ? <div className="table-data">
                <table className="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th scope="col">S/n</th>
                            <th scope="col">Date</th>
                            <th scope="col">Time</th>
                            <th scope="col">Transaction</th>
                            <th scope="col">Type</th>
                            <th scope="col">Amount</th>
                            {(type === "transactions" || type === "deposits") && (<th scope="col">Depositor Name</th>)}
                            {(type === "transactions" || type === "transfers") && (<th scope="col">Receivers acc num.</th>)}
                            {(type === "transactions" || type === "transfers") && (<th scope="col">Receivers acc name</th>)}
                        </tr>
                    </thead>
                    {displayHistory}
                </table>
            </div> : null }
        </div>
    )
}

export default History;