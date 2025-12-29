import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken } from '../services/authService.js'
import { getEvents } from '../services/eventService.js'

export default function DashboardTeacher(){
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

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl mb-4">Teacher Dashboard</h1>
      <p>Welcome — here teachers will see events.</p>

      <h2 className="text-xl mt-4 mb-2">Upcoming Events</h2>
      <ul>
        {events.map(ev=> (
          <li key={ev.id} className="border p-2 rounded mb-2">
            <div className="font-semibold">{ev.title}</div>
            <div className="text-sm text-gray-600">{new Date(ev.eventDate).toLocaleString()} — {ev.venue}</div>
            <div className="text-sm">{ev.description}</div>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <button onClick={handleLogout} className="bg-gray-700 text-white px-3 py-1 rounded">Logout</button>
      </div>
    </div>
  )
}
