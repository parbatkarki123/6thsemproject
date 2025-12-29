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
  return api.post('/api/auth/register', payload)
}

export async function loginStudent(payload){
  return api.post('/api/auth/login', payload)
}

export async function loginAdmin(payload){
  return api.post('/api/auth/admin/login', payload)
}

export async function loginTeacher(payload){
  return api.post('/api/auth/teacher/login', payload)
}

export function saveToken(token){
  localStorage.setItem('auth_token', token)
  api.defaults.headers.common.Authorization = `Bearer ${token}`
}

export function clearToken(){
  localStorage.removeItem('auth_token')
  delete api.defaults.headers.common.Authorization
}

export function getToken(){
  return localStorage.getItem('auth_token')
}

export async function registerTeacher(payload){
  return api.post('/api/auth/register/teacher', payload)
}

export default api
