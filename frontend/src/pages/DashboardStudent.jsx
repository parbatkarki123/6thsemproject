import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken } from '../services/authService.js'
import {
  getApprovedEvents,
  registerForApprovedEvent,
  cancelEventRegistration,
  getStudentRegisteredEvents,
  getStudentCompletedEvents,
  getStudentCertificates,
  downloadCertificate,
  submitFeedback,
  getStudentFeedback,
  getEventFeedback
} from '../services/eventService.js'

export default function DashboardStudent(){
  const navigate = useNavigate()
  const [view, setView] = useState('events') // 'events', 'myRegistrations', 'certificates', 'feedback'
  const [approvedEvents, setApprovedEvents] = useState([])
  const [registeredEvents, setRegisteredEvents] = useState([])
  const [completedEvents, setCompletedEvents] = useState([])
  const [certificates, setCertificates] = useState([])
  const [myFeedback, setMyFeedback] = useState([])
  const [eventFeedback, setEventFeedback] = useState([])
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [viewingCertificate, setViewingCertificate] = useState(null)
  
  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: '' })
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  function handleLogout(){
    clearToken()
    navigate('/')
  }

  async function loadApprovedEvents(){
    try {
      setLoading(true)
      setError('')
      const resp = await getApprovedEvents()
      setApprovedEvents(resp.data.events || [])
    } catch (err) {
      setError('Failed to load events: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  async function loadRegisteredEvents(){
    try {
      setLoading(true)
      setError('')
      const resp = await getStudentRegisteredEvents()
      setRegisteredEvents(resp.data.registrations || [])
    } catch (err) {
      setError('Failed to load registrations: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  async function loadCompletedEvents(){
    try {
      setLoading(true)
      setError('')
      const resp = await getStudentCompletedEvents()
      setCompletedEvents(resp.data.registrations || [])
    } catch (err) {
      setError('Failed to load completed events: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  async function loadCertificates(){
    try {
      setLoading(true)
      setError('')
      const resp = await getStudentCertificates()
      setCertificates(resp.data.certificates || [])
    } catch (err) {
      setError('Failed to load certificates: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  async function loadMyFeedback(){
    try {
      setLoading(true)
      setError('')
      const resp = await getStudentFeedback()
      setMyFeedback(resp.data.feedback || [])
    } catch (err) {
      setError('Failed to load feedback: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(eventId){
    try {
      await registerForApprovedEvent(eventId)
      alert('Successfully registered!')
      loadApprovedEvents()
      loadRegisteredEvents()
    } catch (err) {
      setError('Failed to register: ' + (err.response?.data?.error || err.message))
    }
  }

  async function handleCancelRegistration(eventId){
    if (!window.confirm('Are you sure you want to cancel this registration?')) return
    try {
      await cancelEventRegistration(eventId)
      alert('Registration cancelled')
      loadApprovedEvents()
      loadRegisteredEvents()
    } catch (err) {
      setError('Failed to cancel: ' + (err.response?.data?.error || err.message))
    }
  }

  async function handleDownloadCertificate(certId, eventTitle = 'Certificate'){
    try {
      const resp = await downloadCertificate(certId)
      
      // Handle blob download
      const url = window.URL.createObjectURL(new Blob([resp.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${eventTitle.replace(/[^a-z0-9]/gi, '_')}_Certificate.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError('Failed to download: ' + (err.response?.data?.error || err.message))
    }
  }

  async function handleSubmitFeedback(eventId){
    if (!feedbackForm.comment.trim()) {
      setError('Please enter a comment')
      return
    }
    try {
      await submitFeedback({ eventId, rating: Number(feedbackForm.rating), comment: feedbackForm.comment })
      alert('Feedback submitted!')
      setFeedbackForm({ rating: 5, comment: '' })
      setShowFeedbackForm(false)
      loadMyFeedback()
    } catch (err) {
      setError('Failed to submit feedback: ' + (err.response?.data?.error || err.message))
    }
  }

  async function loadEventFeedback(eventId){
    try {
      setLoading(true)
      setError('')
      const resp = await getEventFeedback(eventId)
      setEventFeedback(resp.data.feedback || [])
      setSelectedEventId(eventId)
      setView('eventFeedback')
    } catch (err) {
      setError('Failed to load feedback: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApprovedEvents()
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>

      </div>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      <div className="flex gap-4 mb-6 border-b overflow-x-auto">
        <button
          onClick={() => { setView('events'); loadApprovedEvents() }}
          className={`px-4 py-2 whitespace-nowrap ${view === 'events' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
        >
          Available Events
        </button>
        <button
          onClick={() => { setView('myRegistrations'); loadRegisteredEvents() }}
          className={`px-4 py-2 whitespace-nowrap ${view === 'myRegistrations' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
        >
          My Registrations
        </button>
        <button
          onClick={() => { setView('completed'); loadCompletedEvents() }}
          className={`px-4 py-2 whitespace-nowrap ${view === 'completed' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
        >
          Completed Events
        </button>
        <button
          onClick={() => { setView('certificates'); loadCertificates() }}
          className={`px-4 py-2 whitespace-nowrap ${view === 'certificates' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
        >
          Certificates
        </button>
        <button
          onClick={() => { setView('feedback'); loadMyFeedback() }}
          className={`px-4 py-2 whitespace-nowrap ${view === 'feedback' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
        >
          My Feedback
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}

      {/* Available Events - Registration System */}
      {view === 'events' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Events</h2>
          {approvedEvents.length === 0 ? (
            <p className="text-gray-600">No approved events available.</p>
          ) : (
            <div className="grid gap-4">
              {approvedEvents.map(event => (
                <div key={event.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">{new Date(event.eventDate).toLocaleString()} — {event.venue}</p>
                      <p className="text-sm mt-2">{event.description}</p>
                      <p className="text-xs text-gray-500 mt-2">By: {event.createdBy.name}</p>
                    </div>
                    <button
                      onClick={() => handleRegister(event.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-4"
                    >
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Registrations */}
      {view === 'myRegistrations' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Registrations</h2>
          {registeredEvents.length === 0 ? (
            <p className="text-gray-600">You haven't registered for any events yet.</p>
          ) : (
            <div className="grid gap-4">
              {registeredEvents.map(reg => (
                <div key={reg.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{reg.event.title}</h3>
                      <p className="text-sm text-gray-600">{new Date(reg.event.eventDate).toLocaleString()} — {reg.event.venue}</p>
                      <p className="text-sm mt-2">{reg.event.description}</p>
                      <p className="text-xs text-gray-500 mt-2">Status: {reg.status}</p>
                    </div>
                    <button
                      onClick={() => handleCancelRegistration(reg.event.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-4"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completed Events */}
      {view === 'completed' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Completed Events</h2>
          {completedEvents.length === 0 ? (
            <p className="text-gray-600">No completed events yet.</p>
          ) : (
            <div className="grid gap-4">
              {completedEvents.map(reg => (
                <div key={reg.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{reg.event.title}</h3>
                      <p className="text-sm text-gray-600">{new Date(reg.event.eventDate).toLocaleString()} — {reg.event.venue}</p>
                      <p className="text-sm mt-2">{reg.event.description}</p>
                    </div>
                    <button
                      onClick={() => { setSelectedEventId(reg.event.id); setShowFeedbackForm(true); setView('feedback') }}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-4"
                    >
                      Leave Feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Certificates */}
      {view === 'certificates' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Certificates</h2>
          {certificates.length === 0 ? (
            <p className="text-gray-600">No certificates yet.</p>
          ) : (
            <div className="grid gap-4">
              {certificates.map(cert => (
                <div key={cert.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{cert.event.title}</h3>
                      <p className="text-sm text-gray-600">Event: {new Date(cert.event.eventDate).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Issued: {new Date(cert.issuedAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setViewingCertificate(cert)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadCertificate(cert.id, cert.event.title)}
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Feedback */}
      {view === 'feedback' && (
        <div>
          {showFeedbackForm ? (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
              <button onClick={() => setShowFeedbackForm(false)} className="mb-4 px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500">
                ← Back
              </button>
              <h2 className="text-2xl font-semibold mb-4">Submit Feedback</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating (1-5 stars) *</label>
                  <select
                    value={feedbackForm.rating}
                    onChange={e => setFeedbackForm({...feedbackForm, rating: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Comments *</label>
                  <textarea
                    value={feedbackForm.comment}
                    onChange={e => setFeedbackForm({...feedbackForm, comment: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Share your feedback..."
                    rows={4}
                  />
                </div>
                <button
                  onClick={() => handleSubmitFeedback(selectedEventId)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-4">My Feedback</h2>
              {myFeedback.length === 0 ? (
                <p className="text-gray-600">You haven't submitted any feedback yet.</p>
              ) : (
                <div className="grid gap-4">
                  {myFeedback.map(fb => (
                    <div key={fb.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500">
                      <h3 className="text-lg font-semibold">{fb.event.title}</h3>
                      <p className="text-sm text-gray-600">Event: {new Date(fb.event.eventDate).toLocaleString()}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-yellow-500 text-lg">{'★'.repeat(fb.rating)}{'☆'.repeat(5-fb.rating)}</span>
                        <span className="text-sm text-gray-600 ml-2">({fb.rating}/5)</span>
                      </div>
                      <p className="text-sm mt-2">{fb.comment}</p>
                      <p className="text-xs text-gray-500 mt-2">Submitted: {new Date(fb.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {viewingCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">Certificate: {viewingCertificate.event.title}</h3>
              <button
                onClick={() => setViewingCertificate(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <iframe
                src={viewingCertificate.fileUrl}
                className="w-full h-[70vh] border rounded"
                title="Certificate"
              />
            </div>
            <div className="p-6 border-t flex gap-2 justify-end">
              <button
                onClick={() => setViewingCertificate(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownloadCertificate(viewingCertificate.id, viewingCertificate.event.title)
                  setViewingCertificate(null)
                }}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
