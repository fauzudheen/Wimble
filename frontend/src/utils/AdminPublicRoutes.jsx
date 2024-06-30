import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

const AdminPublicRoutes = () => {
    const isAuthenticated = useSelector(state => state.auth.isAdminAuthenticated)
    const navigate = useNavigate()

    useEffect(() => {
        console.log("useEffect works")
        if (isAuthenticated) {
            navigate('/admin/dashboard')
        }
    }, [isAuthenticated, navigate])

  return !isAuthenticated ? <Outlet /> : null
}

export default AdminPublicRoutes
