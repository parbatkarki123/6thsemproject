import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { getToken, clearToken } from './services/authService.js'
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

  useEffect(()=>{
    function onAuthChange(){ setIsAuthed(Boolean(getToken())) }
    window.addEventListener('authChange', onAuthChange)
    return ()=> window.removeEventListener('authChange', onAuthChange)
  }, [])

  function handleLogout(){
    clearToken()
    setIsAuthed(false)
    window.location.href = '/'
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <header className="p-4 header shadow-sm">
          <nav className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="site-title flex items-center gap-2">
                <img src="/college-hero.svg" alt="logo" style={{width:28,height:28}} />
                <span>CollegeEvents</span>
              </Link>
              <div className="hidden md:flex gap-6 text-sm text-gray-600">
                  <Link to="/">Home</Link>
                  <Link to="/about">About Us</Link>
                  <Link to="/gallery">Gallery</Link>
                </div>
            </div>
            <div>
              {isAuthed ? (
                <button onClick={handleLogout} className="btn">Logout</button>
              ) : (
                <Link to="/login" className="btn">Login</Link>
              )}
            </div>
          </nav>
        </header>

        <main className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<div>About Us — College Event Management</div>} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/student" element={<StudentRegister />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/student-dashboard" element={<DashboardStudent />} />
            <Route path="/admin-dashboard" element={<DashboardAdmin />} />
            <Route path="/teacher-dashboard" element={<DashboardTeacher />} />
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
    </BrowserRouter>
  )
}

export default App