import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken } from '../services/authService.js'
import { getEvents, registerEvent } from '../services/eventService.js'

export default function DashboardStudent(){
  const navigate = useNavigate()
  const [events, setEvents] = useState([])

  function handleLogout(){
    clearToken()
    navigate('/')
  }

  async function load(){
    const resp = await getEvents()
    setEvents(resp.data.events || [])
  }

  useEffect(()=>{ load() }, [])

  async function handleRegister(id){
    try{
      await registerEvent(id)
      alert('Registered')
    }catch(err){
      alert(err.response?.data?.error || String(err))
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl mb-4">Student Dashboard</h1>
      <p>Welcome — here students will see events and register.</p>

      <h2 className="text-xl mt-4 mb-2">Upcoming Events</h2>
      <ul>
        {events.map(ev=> (
          <li key={ev.id} className="border p-2 rounded mb-2 flex justify-between items-start">
            <div>
              <div className="font-semibold">{ev.title}</div>
              <div className="text-sm text-gray-600">{new Date(ev.eventDate).toLocaleString()} — {ev.venue}</div>
              <div className="text-sm">{ev.description}</div>
            </div>
            <div>
              <button onClick={()=>handleRegister(ev.id)} className="bg-green-600 text-white px-2 py-1 rounded">Register</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <button onClick={handleLogout} className="bg-gray-700 text-white px-3 py-1 rounded">Logout</button>
      </div>
    </div>
  )
}
