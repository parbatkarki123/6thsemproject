import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm.jsx'
import { loginAdmin, saveToken } from '../services/authService.js'

export default function AdminLogin(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    try{
      const resp = await loginAdmin({email, password})
      if(resp?.data?.token) saveToken(resp.data.token)
      navigate('/admin-dashboard')
    }catch(err){
      setError(err.response?.data?.message || String(err))
    }
  }

  return (
    <AuthForm title="Admin Login" onSubmit={handleSubmit} submitLabel="Login">
      <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Admin Email" className="input" />
      <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="input" />
      {error && <div className="text-red-600">{error}</div>}
    </AuthForm>
  )
}
