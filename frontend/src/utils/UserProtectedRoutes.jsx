import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { GatewayUrl } from '../components/const/urls'
import { setUserLogin, setUserLogout } from '../redux/authSlice'

const UserProtectedRoutes = () => {
    const isAuthenticated = useSelector(state => state.auth.isUserAuthenticated)
    const refreshToken = useSelector(state => state.auth.userRefresh)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const updateToken = async() => {
        console.log("updateToken works")
        console.log("Refresh Token:", refreshToken)
        try{
            const response = await axios.post(`${GatewayUrl}api/token/refresh/`, {refresh: refreshToken});
            if (response.status === 200) {
                dispatch(setUserLogin(response.data));
                } else {
                    throw new Error('Token refresh failed');
                }
            } catch (error) {
                console.error('Failed to refresh token:', error);
                dispatch(setUserLogout());
                navigate('/login');
            }

    }

    useEffect(() => {
        if (isAuthenticated) {
            updateToken();
        } else {
            navigate('/login')
        }
    }, [isAuthenticated])

    useEffect(() => {
        let interval;
      if (isAuthenticated) {
        interval = setInterval(updateToken, 28 * 60 * 1000); 
      }
      return () => clearInterval(interval);
    }, [isAuthenticated, refreshToken, dispatch, navigate ])

  return isAuthenticated ? <Outlet /> : null
}

export default UserProtectedRoutes
