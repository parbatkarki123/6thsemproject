import React from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken } from '../services/authService.js'

export default function DashboardAdmin(){
  const navigate = useNavigate()
  function handleLogout(){
    clearToken()
    navigate('/')
  }
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <p>Welcome — admin can create and manage events here.</p>
      <div className="mt-4">
        <button onClick={handleLogout} className="bg-gray-700 text-white px-3 py-1 rounded">Logout</button>
      </div>
    </div>
  )
}
