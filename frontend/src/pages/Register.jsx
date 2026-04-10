import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm.jsx'
import { registerStudent, registerTeacher, saveToken } from '../services/authService.js'

export default function Register(){
  const [role, setRole] = useState('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    try{
      let resp
      if(role === 'student') resp = await registerStudent({name, email, password})
      else resp = await registerTeacher({name, email, password})

      // if(resp?.data?.token) saveToken(resp.data.token, role.toUpperCase()) // Token should be saved after login
      navigate('/login')
    }catch(err){
      setError(err.response?.data?.message || err.response?.data?.error || String(err))
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4 flex gap-2">
        <button onClick={()=>setRole('student')} className={role==='student'? 'btn' : 'btn secondary'}>Student</button>
        <button onClick={()=>setRole('teacher')} className={role==='teacher'? 'btn' : 'btn secondary'}>Teacher</button>
      </div>

      <AuthForm title={`Register as ${role}`} onSubmit={handleSubmit} submitLabel="Register">
        <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="input" />
        <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="input" />
        <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="input" />
        <input required type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="input" />
        {error && <div className="text-red-600">{error}</div>}
      </AuthForm>
    </div>
  )
}
