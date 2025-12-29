import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import StudentRegister from './pages/StudentRegister.jsx'
import StudentLogin from './pages/StudentLogin.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import DashboardStudent from './pages/DashboardStudent.jsx'
import DashboardAdmin from './pages/DashboardAdmin.jsx'
import DashboardTeacher from './pages/DashboardTeacher.jsx'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="p-4 bg-white shadow-sm">
          <nav className="container mx-auto flex items-center justify-between">
            <div className="flex gap-6">
              <Link to="/" className="font-semibold">Home</Link>
              <Link to="/about" className="">About Us</Link>
              <Link to="/gallery" className="">Gallery</Link>
            </div>
            <div>
              <Link to="/login" className="bg-blue-600 text-white px-3 py-1 rounded">Login</Link>
            </div>
          </nav>
        </header>

        <main className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<div>About Us — College Event Management</div>} />
            <Route path="/gallery" element={<div>Gallery — photos coming soon</div>} />
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
      </div>
    </BrowserRouter>
  )
}

export default App