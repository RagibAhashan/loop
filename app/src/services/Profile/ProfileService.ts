import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../../global-store/GlobalStore';
import { UserProfile } from '../../interfaces/TaskInterfaces';

export interface UserProfileState {
    [key: string]: UserProfile;
}

export interface ProfilePayload {
    profile: UserProfile;
    name: string;
}

const initialState = {} as UserProfileState;

export const profileSlice = createSlice({
    name: 'profiles',
    initialState: initialState,
    reducers: {
        createProfile: (state, action: PayloadAction<ProfilePayload>) => {
            console.log('adding profile', current(state), action);
            state[action.payload.name] = action.payload.profile;
        },
        deleteProfile: (state, action: PayloadAction<string>) => {
            delete state[action.payload];
        },
    },
});

// SELECTORS
export const getProfiles = (state: AppState) => state.profiles;

// ACTIONS
export const { createProfile, deleteProfile } = profileSlice.actions;

// DEFAULT EXPORT
export default profileSlice.reducer;
