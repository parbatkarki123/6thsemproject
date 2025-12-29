import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken } from '../services/authService.js'
import { getEvents, createEvent, deleteEvent } from '../services/eventService.js'

export default function DashboardAdmin(){
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [venue, setVenue] = useState('')

  function handleLogout(){
    clearToken()
    navigate('/')
  }

  async function load(){
    const resp = await getEvents()
    setEvents(resp.data.events || [])
  }

  useEffect(()=>{ load() }, [])

  async function handleAdd(e){
    e.preventDefault()
    try{
      await createEvent({ title, description, eventDate, venue })
      setTitle('')
      setDescription('')
      setEventDate('')
      setVenue('')
      await load()
    }catch(err){
      console.error(err)
      alert(err.response?.data?.error || String(err))
    }
  }

  async function handleDelete(id){
    if(!confirm('Delete event?')) return
    await deleteEvent(id)
    await load()
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>

      <form onSubmit={handleAdd} className="mb-6 grid gap-2">
        <input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="border p-2 rounded" />
        <input value={venue} onChange={e=>setVenue(e.target.value)} placeholder="Venue" className="border p-2 rounded" />
        <input required type="datetime-local" value={eventDate} onChange={e=>setEventDate(e.target.value)} className="border p-2 rounded" />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Add Event</button>
      </form>

      <h2 className="text-xl mb-2">Events</h2>
      <ul>
        {events.map(ev=> (
          <li key={ev.id} className="border p-2 rounded mb-2 flex justify-between items-start">
            <div>
              <div className="font-semibold">{ev.title}</div>
              <div className="text-sm text-gray-600">{new Date(ev.eventDate).toLocaleString()} — {ev.venue}</div>
              <div className="text-sm">{ev.description}</div>
            </div>
            <div>
              <button onClick={()=>handleDelete(ev.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
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
