import React from 'react'

export default function Home(){
  return (
    <div className="space-y-6">
      <section className="bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-2">College Event Management</h1>
        <p>Welcome to the college event portal. Students, teachers and admins can manage events here.</p>
      </section>

      <section id="about" className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold">About Us</h2>
        <p className="mt-2">We are a college team organizing events and workshops. Use the portal to register and participate.</p>
      </section>

      <section id="gallery" className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold">Gallery</h2>
        <p className="mt-2">Gallery will show event photos. (Placeholder)</p>
      </section>
    </div>
  )
}
