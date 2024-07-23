import React from 'react'
import Navbar from '../../components/user/Navbar'
import { Outlet } from 'react-router-dom'

const NavbarLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>
      <main className="flex-grow pt-16"> {/* Adjust pt-16 based on your Navbar height */}
        <Outlet />
      </main>
    </div>
  )
}

export default NavbarLayout
