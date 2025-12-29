import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm.jsx'
import { registerStudent, registerTeacher, saveToken } from '../services/authService.js'

export default function Register(){
  const [role, setRole] = useState('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    try{
      let resp
      if(role === 'student') resp = await registerStudent({name, email, password})
      else resp = await registerTeacher({name, email, password})

      if(resp?.data?.token) saveToken(resp.data.token, role.toUpperCase())
      navigate(role === 'student' ? '/student-dashboard' : '/teacher-dashboard')
    }catch(err){
      setError(err.response?.data?.message || err.response?.data?.error || String(err))
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4 flex gap-2">
        <button onClick={()=>setRole('student')} className={`px-3 py-1 rounded ${role==='student'?'bg-blue-600 text-white':''}`}>Student</button>
        <button onClick={()=>setRole('teacher')} className={`px-3 py-1 rounded ${role==='teacher'?'bg-blue-600 text-white':''}`}>Teacher</button>
      </div>

      <AuthForm title={`Register as ${role}`} onSubmit={handleSubmit} submitLabel="Register">
        <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="border p-2 rounded" />
        <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="border p-2 rounded" />
        <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="border p-2 rounded" />
        {error && <div className="text-red-600">{error}</div>}
      </AuthForm>
    </div>
  )
}
