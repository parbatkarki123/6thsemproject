import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm.jsx'
import { registerStudent, saveToken } from '../services/authService.js'

export default function StudentRegister(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    try{
      const resp = await registerStudent({name, email, password})
      if(resp?.data?.token) saveToken(resp.data.token)
      navigate('/student-dashboard')
    }catch(err){
      setError(err.response?.data?.message || String(err))
    }
  }

  return (
    <div>
      <AuthForm title="Student Register" onSubmit={handleSubmit} submitLabel="Register">
        <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="input" />
        <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="input" />
        <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="input" />
        {error && <div className="text-red-600">{error}</div>}
      </AuthForm>
    </div>
  )
}
