import React from 'react'

export default function Gallery(){
  const images = ['/real-campus.svg','/event-auditorium.svg','/workshop-event.svg','/group-photo.svg','/conference-event.svg','/sports-event.svg']
  return (
    <div className="max-w-4xl mx-auto card">
      <h1 className="text-2xl mb-4">Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((src, i)=> (
          <div key={i} className="card">
            <img src={src} alt={`gallery-${i}`} className="w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
