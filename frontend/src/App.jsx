import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { getToken, clearToken, getUserDetails } from './services/authService.js'
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
import About from './pages/About.jsx'

function App() {
  const [isAuthed, setIsAuthed] = useState(Boolean(getToken()))
  const [userDetails, setUserDetails] = useState(getUserDetails())
  const [showUserDetails, setShowUserDetails] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{
    function onAuthChange(){
      setIsAuthed(Boolean(getToken()))
      setUserDetails(getUserDetails())
    }
    window.addEventListener('authChange', onAuthChange)
    // initialize role on mount
    setUserDetails(getUserDetails())
    return ()=> window.removeEventListener('authChange', onAuthChange)
  }, [])

  function handleLogout(){
    clearToken()
    setIsAuthed(false)
    navigate('/')
  }

  const dashboardPath = userDetails?.role === 'ADMIN' ? '/admin-dashboard' : userDetails?.role === 'TEACHER' ? '/teacher-dashboard' : '/student-dashboard'
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
            <div className="relative flex items-center gap-3">
              {isAuthed ? (
                <>
                  <button onClick={() => setShowUserDetails(!showUserDetails)} className="btn ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button>
                  <button onClick={handleLogout} className="btn ghost">Logout</button>
                  {showUserDetails && userDetails && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                      <p className="block px-4 py-2 text-sm text-gray-700">Name: <span className="font-semibold">{userDetails.name}</span></p>
                      <p className="block px-4 py-2 text-sm text-gray-700">Email: <span className="font-semibold">{userDetails.email}</span></p>
                      <p className="block px-4 py-2 text-sm text-gray-700">Role: <span className="font-semibold capitalize">{userDetails.role.toLowerCase()}</span></p>
                    </div>
                  )}
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
            <Route path="/about" element={<About />} />
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
      </div>

  )
}

export default App