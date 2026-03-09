import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="space-y-6">
      {/* Hero section with college theme */}
      <section className="card hero hero-college fade-up">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2 title-accent">College Event Management</h1>
          <p className="text-gray-700">Welcome to the official college event portal. Discover upcoming events, register with ease, and manage your participation — all in one place.</p>

        </div>
        <div className="hidden md:block">
          <img 
            alt="college" 
            src="https://www.shutterstock.com/image-photo/university-students-walking-on-college-600nw-2678260307.jpg"
            style={{width:400, height:260, objectFit:'cover', borderRadius: '8px', opacity:0.95}} 
          />
        </div>
      </section>

      {/* Highlights / Features */}
      <section className="card section fade-up">
        <h2 className="text-2xl font-semibold">Why use our portal?</h2>
        <div className="features-grid mt-4">
          <div className="feature-card">
            <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-100">
              <img 
                src="https://media.istockphoto.com/id/1455437345/photo/hoover-tower-stanford-university-against-the-blue-sky.jpg?s=612x612&w=0&k=20&c=PKYb4w8MO7Z7ZOxkYVFmzITvbZUKKK10Cmg9QyepPUc=" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <div className="font-semibold text-lg">Easy Registration</div>
              <div className="text-sm text-gray-600">Register for approved events in seconds and track your status.</div>
            </div>
          </div>
          <div className="feature-card">
            <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80" 
                alt="" 
                onError={(e) => { e.target.src = "/team-collab.svg"; e.target.onerror = null; }}
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <div className="font-semibold text-lg">Organize & Collaborate</div>
              <div className="text-sm text-gray-600">Teachers propose events, admins approve, students participate.</div>
            </div>
          </div>
          <div className="feature-card">
            <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=150&q=80" 
                alt="" 
                onError={(e) => { e.target.src = "/group-photo.svg"; e.target.onerror = null; }}
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <div className="font-semibold text-lg">Celebrate Campus Life</div>
              <div className="text-sm text-gray-600">Explore the gallery of past workshops, sports, and fests.</div>
            </div>
          </div>
        </div>
      </section>

      {/* About the College */}
      <section id="about" className="card section fade-up">
        <div className="flex gap-6 items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">About Our College</h2>
            <p className="mt-2 text-gray-700">We foster a vibrant campus culture through events and workshops across departments. This portal helps streamline event approvals, registrations, feedback, and certificates.</p>
          </div>
          <img src="/real-campus.jpg" alt="campus" style={{width:220}} className="hidden md:block" />
        </div>
      </section>

      {/* Gallery preview */}
      <section id="gallery" className="card section fade-up">
        <h2 className="text-2xl font-semibold">Campus Gallery</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80" 
            alt="workshop" 
            onError={(e) => { e.target.src = "/workshop-event.svg"; e.target.onerror = null; }}
            className="w-full h-48 object-cover rounded shadow" 
          />
          <img 
            src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80" 
            alt="sports" 
            onError={(e) => { e.target.src = "/sports-event.svg"; e.target.onerror = null; }}
            className="w-full h-48 object-cover rounded shadow" 
          />
        </div>
        <div className="mt-4">
          <Link to="/gallery" className="btn secondary">See all photos</Link>
        </div>
      </section>
    </div>
  )
}
