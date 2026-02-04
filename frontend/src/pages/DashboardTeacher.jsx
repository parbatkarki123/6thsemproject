import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken } from '../services/authService.js'
import { submitEventRequest, getTeacherRequests, getTeacherApprovedEvents, getEventStudents, downloadParticipantList } from '../services/eventService.js'
import { uploadAdminGalleryImage, getAdminGalleryImages, deleteAdminGalleryImage } from '../services/eventService.js'

export default function DashboardTeacher(){
  const navigate = useNavigate()
  const [view, setView] = useState('requests') // 'requests', 'approved', 'registrations'
  const [requests, setRequests] = useState([])
  const [approvedEvents, setApprovedEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0)

  // Form state
  const [formData, setFormData] = useState({ title: '', description: '', eventDate: '', venue: '' })

  function handleLogout(){
    clearToken()
    navigate('/')
  }

  async function loadRequests(){
    try {
      setLoading(true)
      setError('')
      const resp = await getTeacherRequests()
      setRequests(resp.data.requests || [])
    } catch (err) {
      setError('Failed to load requests: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  async function loadApprovedEvents(){
    try {
      setLoading(true)
      setError('')
      const resp = await getTeacherApprovedEvents()
      setApprovedEvents(resp.data.events || [])
    } catch (err) {
      setError('Failed to load approved events: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  async function loadRegistrations(eventId){
    try {
      setLoading(true)
      setError('')
      const resp = await getEventStudents(eventId)
      setRegistrations(resp.data.registrations || [])
      setSelectedEventId(eventId)
      setView('registrations')
    } catch (err) {
      setError('Failed to load registrations: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitRequest(e){
    e.preventDefault()
    try {
      setError('')
      await submitEventRequest(formData)
      setFormData({ title: '', description: '', eventDate: '', venue: '' })
      alert('Event request submitted successfully!')
      loadRequests()
    } catch (err) {
      setError('Failed to submit request: ' + (err.response?.data?.error || err.message))
    }
  }

  async function handleDownloadCSV(){
    try {
      const resp = await downloadParticipantList(selectedEventId)
      const url = window.URL.createObjectURL(new Blob([resp.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `participants_${selectedEventId}.csv`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    } catch (err) {
      setError('Failed to download participants: ' + (err.response?.data?.error || err.message))
    }
  }

  useEffect(() => {
    loadRequests()
    loadApprovedEvents()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setView('submit')}
          className={`px-4 py-2 ${view === 'submit' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
        >
          Submit Event Request
        </button>
        <button
          onClick={() => { setView('requests'); loadRequests() }}
          className={`px-4 py-2 ${view === 'requests' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
        >
          My Requests
        </button>
        <button
          onClick={() => { setView('approved'); loadApprovedEvents() }}
          className={`px-4 py-2 ${view === 'approved' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
        >
          Approved Events
        </button>
        <button
          onClick={() => setView('gallery')}
          className={`px-4 py-2 ${view === 'gallery' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
        >
          Upload Gallery Images
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}

      {/* Submit Event Request Form */}
      {view === 'submit' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Submit Event Request</h2>
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Science Workshop"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Event description..."
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Event Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={formData.eventDate}
                onChange={e => setFormData({...formData, eventDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Venue</label>
              <input
                type="text"
                value={formData.venue}
                onChange={e => setFormData({...formData, venue: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Room 101"
              />
            </div>
            <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Submit Request
            </button>
          </form>
        </div>
      )}

      {/* My Requests - View Approval Status */}
      {view === 'requests' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Event Requests</h2>
          {requests.length === 0 ? (
            <p className="text-gray-600">No requests submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {requests.map(req => (
                <div key={req.id} className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{borderColor: req.status === 'PENDING' ? '#f59e0b' : req.status === 'APPROVED' ? '#10b981' : '#ef4444'}}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{req.title}</h3>
                      <p className="text-sm text-gray-600">{new Date(req.eventDate).toLocaleString()} — {req.venue}</p>
                      <p className="text-sm mt-1">{req.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-white font-semibold text-sm ${req.status === 'PENDING' ? 'bg-yellow-500' : req.status === 'APPROVED' ? 'bg-green-500' : 'bg-red-500'}`}>
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Approved Events */}
      {view === 'approved' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Approved Events</h2>
          {approvedEvents.length === 0 ? (
            <p className="text-gray-600">No approved events yet.</p>
          ) : (
            <div className="space-y-3">
              {approvedEvents.map(event => (
                <div key={event.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">{new Date(event.eventDate).toLocaleString()} — {event.venue}</p>
                      <p className="text-sm mt-1">{event.description}</p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => loadRegistrations(event.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        View Registrations
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Registrations for Selected Event */}
      {view === 'registrations' && (
        <div>
          <button onClick={() => setView('approved')} className="mb-4 px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500">
            ← Back to Approved Events
          </button>
          <h2 className="text-2xl font-semibold mb-4">Event Registrations (Event ID: {selectedEventId})</h2>
          <button
            onClick={handleDownloadCSV}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Download Participant List (CSV)
          </button>
          {registrations.length === 0 ? (
            <p className="text-gray-600">No registrations yet.</p>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">User ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map(reg => (
                    <tr key={reg.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{reg.user.id}</td>
                      <td className="px-4 py-2">{reg.user.name}</td>
                      <td className="px-4 py-2">{reg.user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Gallery Image Upload */}
      {view === 'gallery' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Upload Gallery Images</h2>
          <GalleryImageUploader onUploadSuccess={()=>{ setGalleryRefreshKey(k=>k+1) }} />
        </div>
      )}
    </div>
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

