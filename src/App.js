import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
// import { AuthContext } from "./Context/AuthContext";
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import Footer from './components/footer/Footer';
import Signup from './components/signup/Signup';
import Signin from './components/signin/Signin';
import Deposit from './components/deposit/Deposit';
import Withdraw from './components/withdraw/Withdraw';
import Deposit_history from './components/history/deposit_history/Deposit_history';
import Transaction_history from './components/history/transaction_history/Transaction_history';
import Withdrawal_history from './components/history/withdrawal_history/Withdrawal_history';
import Transfer_history from "./components/history/transfer_history/Transfer_history";
import Transfer from "./components/transfer/Transfer";
import Manage_users from './components/manage_users/Manage_users';
import { Not_Found } from './components/not_found/Not_Found';
import * as api from "./API/api";

import PrivateRoutes from './HOC/PrivateRoutes';
import PublicRoutes from './HOC/PublicRoutes';


const App = () => {
  const [user, setUser] = useState(null);
  const [server_success_message, set_server_success_message] = useState(null);
  const [pathname, setPathname] = useState(null);

  // component did mount to fetch user if user is signed in with token key;
  useEffect(async () => {
    const response_payload = await api.authenticatedUser();
    // check if meet was unable to get response payload
    if(!response_payload) {
      console.log(response_payload);
      // meaning that the request payload is undefined, exit the function
      return
    } else {
      // there is a response payload from server
      const { data } = response_payload;
      if (data) {
        // set the user object with data from response payload
        setUser(data.user);
        console.log(document.cookie);
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <div className='container-fluid'>
        <Navbar userProp={user} setUser={setUser} />
        <Switch>
          <Route path="/" exact component={() => <Home props={{ user }} />} />
          <PublicRoutes path="/signup" user={user} component={Signup} />
          {/* <Route path="/signup" component={Signup} /> */}
          <PublicRoutes path="/signin" user={user} component={() => <Signin setUser={setUser} />} />
          {/* <Route path="/signin" component={() => <Signin setUser={setUser} />} /> */}
          
          <PrivateRoutes path="/user/deposit" user={user} role={[true]} component={() => <Deposit pathname={pathname} setPathname={setPathname} user={user} setUser={setUser} serverMessage={{server_success_message, set_server_success_message}} />} />
          {/* <Route path='/user/deposit' component={() => <Deposit user={user} setUser={setUser} serverMessage={{server_success_message, set_server_success_message}} />} /> */}
          <PrivateRoutes path='/user/withdraw' user={user} role={[true, false]} component={() => <Withdraw pathname={pathname} setPathname={setPathname} user={user} setUser={setUser} serverMessage={{server_success_message, set_server_success_message}} />} />
          {/* <Route path='/user/withdraw' component={() => <Withdraw user={user} setUser={setUser} serverMessage={{server_success_message, set_server_success_message}} />} /> */}
          <PrivateRoutes path='/user/transfer' user={user} role={[true, false]} component={() => <Transfer pathname={pathname} setPathname={setPathname} user={user} setUser={setUser} serverMessage={{server_success_message, set_server_success_message}} />} />
          {/* <Route path='/user/Transfer' component={() => <Transfer user={user} setUser={setUser} serverMessage={{server_success_message, set_server_success_message}} />} /> */}
          <PrivateRoutes path='/history/deposits' user={user} role={[true, false]} component={() => <Deposit_history user={user} />} />
          {/* <Route path='/history/deposits' component={() => <Deposit_history user={user} />} /> */}
          <PrivateRoutes path='/history/transactions' user={user} role={[true, false]} component={() => <Transaction_history user={user} />} />
          {/* <Route path='/history/transactions' component={() => <Transaction_history user={user} />} /> */}
          <PrivateRoutes path="/history/withdrawals" user={user} role={[true, false]} component={() => <Withdrawal_history user={user} />} />
          {/* <Route path="/history/withdrawals" component={() => <Withdrawal_history user={user} />} /> */}
          <PrivateRoutes path="/history/transfers" user={user} role={[true, false]} component={() => <Transfer_history user={user} /> } />
          {/* <Route path="/history/transfers" component={() => <Transfer_history user={user} /> } /> */}
          {/* <Route path="/admin/users/manage" component={() => <Manage_users admin={user} />} /> */}
          <PrivateRoutes path="/admin/users/manage" user={user} role={[true]} component={() => <Manage_users admin={user} />} />
          {/* not found routes */}
          <Route path='*' component={Not_Found} />
        </Switch>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
