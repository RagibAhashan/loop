import React from 'react';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import SideBar from './components/sidebar';
import CustomerForm from './components/customerForm'


// const Main = () => {
//   return (
//     <Router>
//       <Switch>
//         <Route path="/" component={() => <div />} />
//       </Switch>
//     </Router>
//   );
// };

// interface UserShippingInformation {
//   email: String;
//   firstName: String;
//   lastName: String;
//   address: String;
//   phone: Number;
//   postalCode: String
//   town: String
// };

// interface UserBillingInformation {
//   creditCardNumber: Number;
//   cvc: Number;
//   month: Number;
//   year: Number;
// };

export default function App() {
  return (
    <div>
      Hello!
      <CustomerForm
        // creditInformation={{creditCardNumber: 0,cvc: 0,month: 0,year: 0} as UserBillingInformation}
        // userInfo={{email: "",firstName: "",lastName: "",address: "",phone: 1,postalCode: "",town: ""} as UserShippingInformation}
      />
    </div>
  );
}
