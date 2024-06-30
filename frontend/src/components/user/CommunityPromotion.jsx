import React from 'react'
import { Link } from 'react-router-dom'

const CommunityPromotion = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-md mb-3 flex flex-col justify-center items-center">
  <div className="space-y-4">
    <p className="font-semibold dark:text-white">Wimble Community is a gathering of 1,687 incredible developers.</p>
    <p className="font-normal dark:text-gray-300">We're a platform where coders share knowledge, stay current with trends, and advance their careers.</p>
  </div>
  <div className="flex flex-col items-center mt-4">
    <Link to='/login'>
    <a className="text-teal-500 dark:text-teal-300">Login</a>
    </Link>
    <Link to='/signup'>
    <button className="bg-gradient-to-r from-teal-400 to-blue-500 dark:bg-gradient-to-r dark:from-teal-400 dark:to-blue-500 text-white px-4 py-2 rounded-md mt-2">
      Signup
    </button>
    </Link>
  </div>
</nav>


  )
}

export default CommunityPromotion
