import api from './authService.js'

export async function getEvents(){
  return api.get('/api/events')
}

export async function createEvent(payload){
  return api.post('/api/events', payload)
}

export async function deleteEvent(id){
  return api.delete(`/api/events/${id}`)
}

export async function registerEvent(id){
  return api.post(`/api/events/${id}/register`)
}

export default { getEvents, createEvent, deleteEvent, registerEvent }
