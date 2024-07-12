import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
    isUserAuthenticated : null, 
    userAccess : null,
    userRefresh : null,
    userId : null,
    isAdminAuthenticated : null, 
    adminAccess : null,
    adminRefresh : null, 
    darkMode: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserLogin: (state, action) => {
            state.isUserAuthenticated = true;
            state.userAccess = action.payload.access;
            state.userRefresh = action.payload.refresh;
            const decodedToken = jwtDecode(action.payload.access);
            const  userId = decodedToken.user_id;
            state.userId = userId;
        },
        setUserLogout: (state) => {
            state.isUserAuthenticated = false;
            state.userAccess = null;
            state.userRefresh = null;
            state.userId = null;
        },
        setAdminLogin: (state, action) => {
            state.isAdminAuthenticated = true;
            state.adminAccess = action.payload.access;
            state.adminRefresh = action.payload.refresh;
        },
        setAdminLogout: (state) => {
            state.isAdminAuthenticated = false;
            state.adminAccess = null;
            state.adminRefresh = null;
        },
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        }
    }
})

export const{ setUserLogin, setUserLogout, setAdminLogin, setAdminLogout, toggleDarkMode } = authSlice.actions
export default authSlice.reducer;