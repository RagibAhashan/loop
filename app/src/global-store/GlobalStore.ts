import { configureStore } from '@reduxjs/toolkit';
import profileSlice from '../services/Profile/ProfileService';
import proxySlice from '../services/Proxy/ProxyService';
import storeSlice from '../services/Store/StoreService';

console.log(process.env.NODE_ENV === 'development');
export const store = configureStore({
    reducer: {
        profiles: profileSlice,
        stores: storeSlice,
        proxies: proxySlice,
    },
    preloadedState: JSON.parse(localStorage.getItem('state') ?? '{}'),
    devTools: process.env.NODE_ENV === 'development',
});

// Rudimentary persist logic, persist state on every change
store.subscribe(() => {
    localStorage.setItem('state', JSON.stringify(store.getState()));
});

// these are imported types to be used with useDispatch<AppDispatch>
// and useSelector(state: AppState)
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
