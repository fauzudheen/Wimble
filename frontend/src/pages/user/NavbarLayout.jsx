import React from 'react'
import Navbar from '../../components/user/Navbar'
import { Outlet } from 'react-router-dom'

const NavbarLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default NavbarLayout
