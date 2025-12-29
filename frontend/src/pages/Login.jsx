import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthForm from '../components/AuthForm.jsx'
import { loginStudent, loginTeacher, loginAdmin, saveToken } from '../services/authService.js'

export default function Login(){
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    try{
      let resp
      if(role === 'student') resp = await loginStudent({email, password})
      else if(role === 'teacher') resp = await loginTeacher({email, password})
      else resp = await loginAdmin({email, password})

      if(resp?.data?.token) {
        saveToken(resp.data.token, resp.data.user?.role)
      }
      if(role === 'admin') navigate('/admin-dashboard')
      else if(role === 'teacher') navigate('/teacher-dashboard')
      else navigate('/student-dashboard')
    }catch(err){
      setError(err.response?.data?.message || err.response?.data?.error || String(err))
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4 flex gap-2">
        <button onClick={()=>setRole('student')} className={`px-3 py-1 rounded ${role==='student'?'bg-blue-600 text-white':''}`}>Student</button>
        <button onClick={()=>setRole('teacher')} className={`px-3 py-1 rounded ${role==='teacher'?'bg-blue-600 text-white':''}`}>Teacher</button>
        <button onClick={()=>setRole('admin')} className={`px-3 py-1 rounded ${role==='admin'?'bg-blue-600 text-white':''}`}>Admin</button>
      </div>

      <AuthForm title={`${role[0].toUpperCase()+role.slice(1)} Login`} onSubmit={handleSubmit} submitLabel="Login">
        <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="border p-2 rounded" />
        <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="border p-2 rounded" />
        {error && <div className="text-red-600">{error}</div>}
      </AuthForm>

      {role !== 'admin' && (
        <div className="text-center mt-4">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-blue-600">Register</Link>
        </div>
      )}
    </div>
  )
}

