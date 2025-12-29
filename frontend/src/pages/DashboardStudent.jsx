import React from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken } from '../services/authService.js'

export default function DashboardStudent(){
  const navigate = useNavigate()
  function handleLogout(){
    clearToken()
    navigate('/')
  }
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl mb-4">Student Dashboard</h1>
      <p>Welcome — here students will see events and register.</p>
      <div className="mt-4">
        <button onClick={handleLogout} className="bg-gray-700 text-white px-3 py-1 rounded">Logout</button>
      </div>
    </div>
  )
}
