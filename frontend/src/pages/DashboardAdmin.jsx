import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken } from '../services/authService.js'
import { getEvents, createEvent, updateEvent, deleteEvent, getEventRegistrations, removeStudentFromEvent } from '../services/eventService.js'

export default function DashboardAdmin(){
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState({})
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [venue, setVenue] = useState('')
  const [expandedEvent, setExpandedEvent] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editEventDate, setEditEventDate] = useState('')
  const [editVenue, setEditVenue] = useState('')

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

  function startEdit(event){
    setEditingId(event.id)
    setEditTitle(event.title)
    setEditDescription(event.description)
    setEditVenue(event.venue)
    // Convert to datetime-local format
    const date = new Date(event.eventDate)
    const isoString = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    setEditEventDate(isoString)
  }

  async function handleSaveEdit(){
    try{
      await updateEvent(editingId, {
        title: editTitle,
        description: editDescription,
        eventDate: editEventDate,
        venue: editVenue
      })
      setEditingId(null)
      await load()
    }catch(err){
      alert(err.response?.data?.error || String(err))
    }
  }

  async function handleDelete(id){
    if(!confirm('Delete event?')) return
    await deleteEvent(id)
    await load()
  }

  async function loadRegistrations(eventId){
    try{
      const resp = await getEventRegistrations(eventId)
      setRegistrations({ ...registrations, [eventId]: resp.data.registrations || [] })
    }catch(err){
      console.error(err)
      alert('Failed to load registrations')
    }
  }

  function toggleExpand(eventId){
    if(expandedEvent === eventId){
      setExpandedEvent(null)
    }else{
      setExpandedEvent(eventId)
      if(!registrations[eventId]){
        loadRegistrations(eventId)
      }
    }
  }

  async function handleRemoveStudent(eventId, userId){
    if(!confirm('Remove student from event?')) return
    try{
      await removeStudentFromEvent(eventId, userId)
      await loadRegistrations(eventId)
    }catch(err){
      alert(err.response?.data?.error || String(err))
    }
  }

  return (
    <div className="max-w-4xl mx-auto card">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>

      <form onSubmit={handleAdd} className="mb-6 grid gap-2">
        <input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="input" />
        <input value={venue} onChange={e=>setVenue(e.target.value)} placeholder="Venue" className="input" />
        <input required type="datetime-local" value={eventDate} onChange={e=>setEventDate(e.target.value)} className="input" />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="input" />
        <button type="submit" className="btn">Add Event</button>
      </form>

      <h2 className="text-xl mb-2">Events</h2>
      <ul>
        {events.map(ev=> (
          <li key={ev.id} className="card mb-2">
            {editingId === ev.id ? (
              <div className="grid gap-2">
                <input value={editTitle} onChange={e=>setEditTitle(e.target.value)} placeholder="Title" className="input" />
                <input value={editVenue} onChange={e=>setEditVenue(e.target.value)} placeholder="Venue" className="input" />
                <input type="datetime-local" value={editEventDate} onChange={e=>setEditEventDate(e.target.value)} className="input" />
                <textarea value={editDescription} onChange={e=>setEditDescription(e.target.value)} placeholder="Description" className="input" />
                <div className="flex gap-2">
                  <button onClick={handleSaveEdit} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                  <button onClick={()=>setEditingId(null)} className="bg-gray-600 text-white px-3 py-1 rounded">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold">{ev.title}</div>
                    <div className="text-sm text-gray-600">{new Date(ev.eventDate).toLocaleString()} — {ev.venue}</div>
                    <div className="text-sm">{ev.description}</div>
                  </div>
                  <div className="flex gap-2">
                      <button onClick={()=>toggleExpand(ev.id)} className="btn success">{expandedEvent === ev.id ? 'Hide' : 'Show'} Students</button>
                      <button onClick={()=>startEdit(ev)} className="btn">Edit</button>
                      <button onClick={()=>handleDelete(ev.id)} className="btn danger">Delete</button>
                    </div>
                </div>

                {expandedEvent === ev.id && (
                  <div className="mt-4 ml-4 border-l-2 pl-4">
                    <h3 className="font-semibold mb-2">Registered Students ({(registrations[ev.id] || []).length})</h3>
                    {registrations[ev.id] && registrations[ev.id].length > 0 ? (
                      <ul className="space-y-2">
                        {registrations[ev.id].map(reg=> (
                            <li key={reg.id} className="flex justify-between items-center card">
                            <div>
                              <div className="font-semibold">{reg.user.name}</div>
                              <div className="text-sm text-gray-600">{reg.user.email}</div>
                            </div>
                              <button onClick={()=>handleRemoveStudent(ev.id, reg.user.id)} className="btn danger">Remove</button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No students registered</p>
                    )}
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex gap-4 flex-wrap">
        <img src="/event-auditorium.svg" alt="auditorium" style={{width:300}} />
        <img src="/conference-event.svg" alt="conference" style={{width:300}} />
      </div>
      <div className="mt-4">
        
      </div>
    </div>
  )
}
