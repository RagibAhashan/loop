// React Required
import React, { useCallback, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
// holds reference to the current connected user
import { useUser } from './component/common/UserContext';
// Common Layout
// import Layout from "./component/common/App";
import PageScrollTop from './component/PageScrollTop';
import Dashboard from './dark/Dashboard';
import error404 from './dark/error404';
// Dark Home Layout
import DarkMainDemo from './dark/MainDemo';
// Home layout
import Register from './elements/Register';
// Create Import File

const App = () => {
    const { user, fetchUser } = useUser();

    const fetchUserCB = useCallback(async () => {
        await fetchUser();
    }, [fetchUser]);

    console.log('app rerendered', user, user ? 'true' : 'false');
    useEffect(() => {
        fetchUserCB();

        console.log('Init App main route', user);
    }, []);
    return (
        <PageScrollTop>
            <Switch>
                <Route exact path={`${process.env.PUBLIC_URL}/`} component={DarkMainDemo} />
                <Route exact path={`${process.env.PUBLIC_URL}/dashboard`} component={() => <Dashboard />} />
                <Route exact path={`${process.env.PUBLIC_URL}/register`} component={Register} />
                <Route path={`${process.env.PUBLIC_URL}/404`} component={error404} />
                <Route component={error404} />
            </Switch>
        </PageScrollTop>
    );
};

export default App;
