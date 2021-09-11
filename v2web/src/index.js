// React Required
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Create Import File
import './index.scss';

// Common Layout
// import Layout from "./component/common/App";

import PageScrollTop from './component/PageScrollTop';

// Home layout
import Register from './elements/Register';
import Dashboard from './dark/Dashboard'

// Dark Home Layout 
import DarkMainDemo from './dark/MainDemo';

import error404 from "./dark/error404";



import { BrowserRouter, Switch, Route  } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

class Root extends Component{
    render(){
        return(
            <BrowserRouter basename={'/'}>
                <PageScrollTop>
                    <Switch>
                        <Route exact path={`${process.env.PUBLIC_URL}/`} component={DarkMainDemo}/>
                        <Route exact path={`${process.env.PUBLIC_URL}/dashboard`} component={Dashboard}/>
                        <Route exact path={`${process.env.PUBLIC_URL}/register`} component={Register}/>
                        <Route path={`${process.env.PUBLIC_URL}/404`} component={error404}/>
                        <Route component={error404}/>
                    </Switch>
                </PageScrollTop>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<Root/>, document.getElementById('root'));
serviceWorker.register();