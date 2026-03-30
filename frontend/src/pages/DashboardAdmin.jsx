import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken } from '../services/authService.js'
import { getEvents, adminListEvents, createEvent, updateEvent, deleteEvent, getEventRegistrations, removeStudentFromEvent, uploadCertificateTemplate, generateCertificates, exportEventReportExcel, adminApproveEvent, adminRejectEvent, adminCompleteEvent, uploadAdminGalleryImage, getAdminGalleryImages, deleteAdminGalleryImage } from '../services/eventService.js'

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
  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0)

  function handleLogout(){
    clearToken()
    navigate('/')
  }

  async function load(){
    const resp = await adminListEvents()
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
                      <button onClick={async ()=>{ try{ const resp=await generateCertificates(ev.id); alert('Certificates generated: '+ (resp.data.generated?.length||0)) }catch(e){ alert(e.response?.data?.error || e.message) } }} className="btn">Generate Certificates</button>
                      <button onClick={async ()=>{ try{ const resp=await exportEventReportExcel(ev.id); const url=window.URL.createObjectURL(new Blob([resp.data])); const a=document.createElement('a'); a.href=url; a.download=`event_${ev.id}_registrations.xlsx`; document.body.appendChild(a); a.click(); a.remove() }catch(e){ alert(e.response?.data?.error || e.message) } }} className="btn">Download XLSX</button>
                      {ev.status === 'PENDING' && ev.createdBy?.role === 'TEACHER' && (
                        <>
                          <button onClick={async ()=>{ try{ await adminApproveEvent(ev.id); alert('Event approved'); await load() }catch(e){ alert(e.response?.data?.error || e.message) } }} className="btn success">Approve</button>
                          <button onClick={async ()=>{ try{ await adminRejectEvent(ev.id); alert('Event rejected'); await load() }catch(e){ alert(e.response?.data?.error || e.message) } }} className="btn danger">Reject</button>
                        </>
                      )}
                      {ev.status === 'APPROVED' && !ev.isCompleted && (
                        <button onClick={async ()=>{ try{ await adminCompleteEvent(ev.id); alert('Event completed'); await load() }catch(e){ alert(e.response?.data?.error || e.message) } }} className="btn warning">Complete Event</button>
                      )}
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
        <img 
          src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80" 
          alt="auditorium" 
          onError={(e) => { e.target.src = "/event-auditorium.svg"; e.target.onerror = null; }}
          className="rounded shadow" 
          style={{width:300, height:200, objectFit:'cover'}} 
        />
        <img 
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80" 
          alt="conference" 
          onError={(e) => { e.target.src = "/conference-event.svg"; e.target.onerror = null; }}
          className="rounded shadow" 
          style={{width:300, height:200, objectFit:'cover'}} 
        />
      </div>
      <div className="mt-8 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Certificate Template Upload</h2>
        <TemplateUploader />
      </div>

      <div className="mt-8 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Gallery Image Upload</h2>
        <GalleryImageUploader onUploadSuccess={()=>{ setGalleryRefreshKey((k)=>k+1) }} />
      </div>

      <div className="mt-8 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Manage Gallery Images</h2>
        <AdminGalleryManager refreshKey={galleryRefreshKey} />
      </div>
    </div>
  )
}

function TemplateUploader(){
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleUpload(e){
    e.preventDefault()
    if(!file) return alert('Select a file')
    try{
      setLoading(true)
      const fd = new FormData()
      fd.append('file', file)
      await uploadCertificateTemplate(fd)
      alert('Template uploaded')
      setFile(null)
      e.target.reset && e.target.reset()
    }catch(err){
      alert(err.response?.data?.error || err.message)
    }finally{ setLoading(false) }
  }

  return (
    <form onSubmit={handleUpload} className="flex gap-2 items-center">
      <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e=>setFile(e.target.files[0])} />
      <button type="submit" className="btn" disabled={loading}>{loading? 'Uploading...' : 'Upload Template'}</button>
    </form>
  )
}

function GalleryImageUploader({ onUploadSuccess }){
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleUpload(e){
    e.preventDefault()
    setError('')
    if(!file) {
      setError('Please select an image file')
      return
    }
    try{
      setLoading(true)
      const fd = new FormData()
      fd.append('image', file)
      fd.append('title', title || 'Untitled')
      fd.append('description', description)

      await uploadAdminGalleryImage(fd)
      alert('Image uploaded successfully!')
      setFile(null)
      setTitle('')
      setDescription('')
      setError('')
      e.target.reset && e.target.reset()
      if(onUploadSuccess) onUploadSuccess()
    }catch(err){
      console.error('Upload error:', err)
      const msg = err.response?.data?.error || err.message || 'Error uploading image'
      setError(msg)
    }finally{ 
      setLoading(false) 
    }
  }

  return (
    <form onSubmit={handleUpload} className="grid gap-2">
      {error && <div className="text-red-600 text-sm bg-red-100 p-2 rounded">{error}</div>}
      <input 
        type="file" 
        accept="image/*" 
        onChange={e=>setFile(e.target.files[0])} 
        required 
        className="input"
      />
      <input 
        type="text"
        value={title}
        onChange={e=>setTitle(e.target.value)}
        placeholder="Image Title (optional)"
        className="input"
      />
      <textarea 
        value={description}
        onChange={e=>setDescription(e.target.value)}
        placeholder="Image Description (optional)"
        className="input"
      />
      <button type="submit" className="btn" disabled={loading}>
        {loading? 'Uploading...' : 'Upload Image'}
      </button>
    </form>
  )
}

function AdminGalleryManager({ refreshKey }){
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadImages(){
    try{
      setLoading(true)
      setError('')
      const resp = await getAdminGalleryImages()
      setImages(resp.data.images || [])
    }catch(err){
      console.error('Failed to load images', err)
      const msg = err.response?.data?.error || err.message || 'Failed to load images'
      setError(msg)
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ loadImages() }, [])
  useEffect(()=>{ loadImages() }, [refreshKey])

  async function handleDelete(id){
    if(!confirm('Are you sure you want to delete this image?')) return
    try{
      await deleteAdminGalleryImage(id)
      setImages(prev => prev.filter(img => img.id !== id))
    }catch(err){
      console.error('Delete failed', err)
      alert(err.response?.data?.error || err.message || 'Failed to delete')
    }
  }

  if(loading){
    return <div>Loading images...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {error && <div className="text-red-600 text-sm bg-red-100 p-2 rounded col-span-full">{error}</div>}
      {images.length > 0 ? (
        images.map(image => (
          <div key={image.id} className="card">
            <img src={image.imageUrl} alt={image.title || 'gallery-image'} className="w-full rounded" />
            <div className="mt-2 flex items-center justify-between">
              <div>
                {image.title && <p className="text-sm font-semibold">{image.title}</p>}
                {image.description && <p className="text-xs text-gray-600">{image.description}</p>}
                {image.uploadedByUser && <p className="text-[10px] text-gray-400 italic">By: {image.uploadedByUser.name}</p>}
              </div>
              <button className="btn btn-danger" onClick={()=>handleDelete(image.id)}>Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">No images uploaded yet</p>
      )}
    </div>
  )
}
