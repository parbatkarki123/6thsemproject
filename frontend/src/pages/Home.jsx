import React from 'react'

export default function Home(){
  return (
    <div className="space-y-6">
      <section className="card hero">
        <div>
          <h1 className="text-3xl font-bold mb-2">College Event Management</h1>
          <p>Welcome to the college event portal. Students, teachers and admins can manage events here.</p>
        </div>
        <div className="hidden md:block">
          <img alt="events" src="/college-hero.svg" style={{width:220,opacity:0.95}} />
        </div>
      </section>

      <section id="about" className="card flex gap-6 items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">About Us</h2>
          <p className="mt-2">We are a college team organizing events and workshops. Use the portal to register and participate.</p>
        </div>
        <img src="/real-campus.svg" alt="campus" style={{width:200}} className="hidden md:block" />
      </section>

      <section id="gallery" className="card">
        <h2 className="text-2xl font-semibold">Gallery</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <img src="/workshop-event.svg" alt="workshop" className="w-full" />
          <img src="/conference-event.svg" alt="conference" className="w-full" />
        </div>
      </section>
    </div>
  )
}
