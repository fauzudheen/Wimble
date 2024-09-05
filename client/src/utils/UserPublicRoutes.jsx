import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

const UserPublicRoutes = () => {
    const isAuthenticated = useSelector(state => state.auth.isUserAuthenticated)
    const navigate = useNavigate()

    useEffect(() => {
        console.log("useEffect works")
        if (isAuthenticated) {
            navigate('/home')
        }
    }, [isAuthenticated, navigate])

  return !isAuthenticated ? <Outlet /> : null
}

export default UserPublicRoutes
