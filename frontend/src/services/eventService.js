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

// Teacher-specific functions
export async function submitEventRequest(payload){
  return api.post('/api/events/requests', payload)
}

export async function getTeacherRequests(){
  return api.get('/api/events/requests')
}

export async function getTeacherApprovedEvents(){
  return api.get('/api/events/approved')
}

export async function getEventStudents(eventId){
  return api.get(`/api/events/${eventId}/students`)
}

export async function downloadParticipantList(eventId){
  return api.get(`/api/events/${eventId}/participants/download`, { responseType: 'blob' })
}

// Student-specific functions
export async function getApprovedEvents(){
  return api.get('/api/student/events/approved')
}

export async function registerForApprovedEvent(eventId){
  return api.post(`/api/student/events/${eventId}/register`)
}

export async function cancelEventRegistration(eventId){
  return api.delete(`/api/student/events/${eventId}/register`)
}

export async function getRegistrationStatus(eventId){
  return api.get(`/api/student/events/${eventId}/status`)
}

export async function getStudentRegisteredEvents(){
  return api.get('/api/student/profile/registered-events')
}

export async function getStudentCompletedEvents(){
  return api.get('/api/student/profile/completed-events')
}

export async function getStudentCertificates(){
  return api.get('/api/student/profile/certificates')
}

export async function downloadCertificate(certId){
  return api.get(`/api/student/certificates/${certId}/download`)
}

export async function submitFeedback(payload){
  return api.post('/api/student/feedback', payload)
}

export async function getStudentFeedback(){
  return api.get('/api/student/feedback/my')
}

export async function getEventFeedback(eventId){
  return api.get(`/api/student/feedback/event/${eventId}`)
}

export async function getAllFeedback(){
  return api.get('/api/student/feedback/all')
}

// Admin-specific functions (frontend)
export async function uploadCertificateTemplate(formData){
  return api.post('/api/admin/certificates/templates', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export async function generateCertificates(eventId){
  return api.post(`/api/admin/certificates/generate/${eventId}`)
}

export async function exportEventReportExcel(eventId){
  return api.get(`/api/admin/reports/event/${eventId}/excel`, { responseType: 'blob' })
}

export async function exportEventReportPDF(eventId){
  return api.get(`/api/admin/reports/event/${eventId}/pdf`, { responseType: 'blob' })
}

export async function adminListEvents(){
  return api.get('/api/admin/events')
}

// Admin approve/reject/complete
export async function adminApproveEvent(eventId){
  return api.post(`/api/admin/events/${eventId}/approve`)
}

export async function adminRejectEvent(eventId){
  return api.post(`/api/admin/events/${eventId}/reject`)
}

export async function adminCompleteEvent(eventId){
  return api.post(`/api/admin/events/${eventId}/complete`)
}

export default { getEvents, createEvent, updateEvent, deleteEvent, registerEvent, getEventRegistrations, removeStudentFromEvent, submitEventRequest, getTeacherRequests, getTeacherApprovedEvents, getEventStudents, downloadParticipantList, getApprovedEvents, registerForApprovedEvent, cancelEventRegistration, getRegistrationStatus, getStudentRegisteredEvents, getStudentCompletedEvents, getStudentCertificates, downloadCertificate, submitFeedback, getStudentFeedback, getEventFeedback, getAllFeedback, uploadCertificateTemplate, generateCertificates, exportEventReportExcel, exportEventReportPDF, adminApproveEvent, adminRejectEvent, adminListEvents, adminCompleteEvent }
