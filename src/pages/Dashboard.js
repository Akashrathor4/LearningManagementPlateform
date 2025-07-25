import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/core/Dashboard/Sidebar'

const Dashboard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth)
  const { loading: profileLoading } = useSelector((state) => state.profile)

  if (profileLoading || authLoading) {
    return (
      <div className="mt-10 text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full bg-richblack-900 text-white">
      {/* Sidebar: fixed width */}
      <Sidebar />

      {/* Main content: stretch remaining width */}
      {/* When a route has nested routes, the <Outlet /> will render the matching child route's component inside the parent layout.  */}
      {/* it's always visible and helps the user navigate between sections, while the content to the right updates dynamically via <Outlet />. */}
      {/* Use flex-1 when you want a flex item to expand and fill the available space in a flex container proportionally to other items with flex-1. */}
      <div className="flex-1 overflow-y-auto px-6 py-10">
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard

