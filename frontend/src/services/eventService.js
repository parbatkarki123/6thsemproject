import api from './authService.js'

export async function getEvents(){
  return api.get('/api/events')
}

export async function createEvent(payload){
  return api.post('/api/events', payload)
}

export async function updateEvent(id, payload){
  return api.put(`/api/events/${id}`, payload)
}

export async function deleteEvent(id){
  return api.delete(`/api/events/${id}`)
}

export async function registerEvent(id){
  return api.post(`/api/events/${id}/register`)
}

export async function getEventRegistrations(eventId){
  return api.get(`/api/events/${eventId}/registrations`)
}

export async function removeStudentFromEvent(eventId, userId){
  return api.delete(`/api/events/${eventId}/registrations/${userId}`)
}

export default { getEvents, createEvent, updateEvent, deleteEvent, registerEvent, getEventRegistrations, removeStudentFromEvent }
