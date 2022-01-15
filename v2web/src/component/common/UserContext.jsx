import axios from 'axios';
import React, { useContext, useState } from 'react';

const UserContext = React.createContext();

// Expose user context through custom hook
export function useUser() {
    return useContext(UserContext);
}

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(false);
    const [fetchingUser, setFetchingUser] = useState(true);

    const fetchUser = async () => {
        try {
            setFetchingUser(true);
            console.log('trying to get user');
            const resp = await axios.get(process.env.REACT_APP_SERVER_ENDPOINT + '/user', { withCredentials: true });

            console.log('got user', resp['data']);
            setUser(resp['data']);
        } catch (error) {
            console.log('Error, Seems like you are not connected');
            setUser(null);
        }

        setFetchingUser(false);
    };

    const logoutUser = async () => {
        try {
            console.log('trying to logout');
            await axios.get(process.env.REACT_APP_SERVER_ENDPOINT + '/logout', { withCredentials: true });

            setUser(null);
        } catch (error) {
            console.log('Error, Seems like you are not connected');
            setUser(null);
        }
    };

    return <UserContext.Provider value={{ user, fetchUser, logoutUser, fetchingUser, setUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;
