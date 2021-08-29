import './App.css';
import Dashboard from './pages/dashboard';
import LandingPage from './pages/landingPage';

// import { Button } from 'antd';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';


const App = () => {


  return (
    <div style={{height:'100%'}}>

    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={LandingPage} />
            <Route path="/dashboard/" component={Dashboard} />
        </Switch>
    </BrowserRouter>


    </div>
  );
}

export default App;
