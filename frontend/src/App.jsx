import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { getToken, clearToken, getRole } from './services/authService.js'
import StudentRegister from './pages/StudentRegister.jsx'
import StudentLogin from './pages/StudentLogin.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import DashboardStudent from './pages/DashboardStudent.jsx'
import DashboardAdmin from './pages/DashboardAdmin.jsx'
import DashboardTeacher from './pages/DashboardTeacher.jsx'
import Gallery from './pages/Gallery.jsx'

function App() {
  const [isAuthed, setIsAuthed] = useState(Boolean(getToken()))
    const [role, setRole] = useState(getRole())
    const navigate = useNavigate()

  useEffect(()=>{
    function onAuthChange(){
      setIsAuthed(Boolean(getToken()))
      setRole(getRole())
    }
    window.addEventListener('authChange', onAuthChange)
    // initialize role on mount
    setRole(getRole())
    return ()=> window.removeEventListener('authChange', onAuthChange)
  }, [])

  function handleLogout(){
    clearToken()
    setIsAuthed(false)
    navigate('/')
  }

  const dashboardPath = role === 'ADMIN' ? '/admin-dashboard' : role === 'TEACHER' ? '/teacher-dashboard' : '/student-dashboard'
  return (
      <div className="min-h-screen">
        <header className="p-4 header shadow-sm sticky top-0 z-50">
          <nav className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
                <Link to={'/'} className="site-title flex items-center gap-2">
                <img src="/real-campus.jpg" alt="logo" style={{width:28,height:28}} />
                <span>CollegeEvents</span>
              </Link>
              <div className="hidden md:flex gap-8 text-sm text-gray-600">
                    <Link to={'/'}>Home</Link>
                    {isAuthed && <Link to={dashboardPath}>Dashboard</Link>}
                    <Link to="/gallery">Gallery</Link>
                    <Link to="/about">About</Link>
                </div>
            </div>
            <div className="flex items-center gap-3">
              {isAuthed ? (
                <>
                  {/* Dashboard link moved to main navbar */}
                  <button onClick={handleLogout} className="btn ghost">Logout</button>
                </>
              ) : (
                <Link to="/login" className="btn ghost">Login</Link>
              )}
            </div>
          </nav>
        </header>

        <main className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<div className="card">About Us — College Event Management</div>} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/student" element={<StudentRegister />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/student-dashboard" element={<DashboardStudent />} />
            <Route path="/admin-dashboard" element={<DashboardAdmin />} />
            <Route path="/teacher-dashboard" element={<DashboardTeacher />} />
            <Route path="/contact" element={<div className="card">Contact — Reach us at events@college.edu</div>} />
            <Route path="/privacy" element={<div className="card">Privacy — Your data is handled securely.</div>} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-600">© {new Date().getFullYear()} College Event Management</div>
              <div className="flex gap-4 text-sm">
                <Link to="/about" className="text-gray-600">About</Link>
                <Link to="/contact" className="text-gray-600">Contact</Link>
                <Link to="/privacy" className="text-gray-600">Privacy</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>

  )
}

export default App