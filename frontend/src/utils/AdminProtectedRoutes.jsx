import { Outlet, useNavigate } from 'react-router-dom';
import { setAdminLogin, setAdminLogout } from '../redux/authSlice';
import { useEffect } from 'react';
import axios from 'axios';
import { GatewayUrl } from '../components/const/urls';
import { useDispatch, useSelector } from 'react-redux';

const AdminProtectedRoutes = () => {
    const isAuthenticated = useSelector(state => state.auth.isAdminAuthenticated)
    const refreshToken = useSelector(state => state.auth.adminRefresh)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const updateToken = async() => {
        console.log("updateToken works")
        console.log("Refresh Token:", refreshToken)
        try {
            const response = await axios.post(`${GatewayUrl}api/token/refresh/`, {refresh: refreshToken});
            if (response.status === 200) {
                dispatch(setAdminLogin(response.data));
            } else {
                throw new Error('Token refresh failed');
            }
        } catch (error) {
            console.error('Failed to refresh token:', error);
            dispatch(setAdminLogout());
            navigate('/admin/login');
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            updateToken();
        } else {
            navigate('/admin/login')
        }
    }, [isAuthenticated])

    useEffect(() => {
        let interval;
      if (isAuthenticated) {
        interval = setInterval(updateToken, 4 * 60 * 1000); 
      }
      return () => clearInterval(interval);
    }, [isAuthenticated, refreshToken, dispatch, navigate ])

  return isAuthenticated ? <Outlet /> : null
}

export default AdminProtectedRoutes;

