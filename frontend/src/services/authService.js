import axios from 'axios'

const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function registerStudent(payload){
  return api.post('/api/auth/register', { ...payload, role: 'STUDENT' })
}

export async function registerTeacher(payload){
  return api.post('/api/auth/register', { ...payload, role: 'TEACHER' })
}

export async function loginStudent(payload){
  return api.post('/api/auth/login', payload)
}

export async function loginTeacher(payload){
  return api.post('/api/auth/teacher/login', payload)
}

export async function loginAdmin(payload){
  return api.post('/api/auth/admin/login', payload)
}

export function saveToken(token, role = null){
  localStorage.setItem('auth_token', token)
  if (role) localStorage.setItem('user_role', role)
  api.defaults.headers.common.Authorization = `Bearer ${token}`
  try{ window.dispatchEvent(new Event('authChange')) }catch(e){}
}

export function clearToken(){
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_role')
  delete api.defaults.headers.common.Authorization
  try{ window.dispatchEvent(new Event('authChange')) }catch(e){}
}

export function getToken(){
  return localStorage.getItem('auth_token')
}

export function getRole(){
  return localStorage.getItem('user_role')
}

export default api
