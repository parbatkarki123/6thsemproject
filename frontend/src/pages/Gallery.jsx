import React, { useState, useEffect } from 'react'

export default function Gallery(){
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  const fetchGalleryImages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/gallery')
      console.log('Response status:', response.status)
      if (!response.ok) {
        const errorText = await response.text()
        console.log('Error response:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      const data = await response.json()
      console.log('Gallery data received:', data)
      setImages(data.images || [])
    } catch (err) {
      console.error('Error fetching gallery:', err)
      setError(err.message)
      // Fallback to static images if API fails
      setImages([
        { id: 1, imageUrl: '/real-campus.svg', title: 'Campus' },
        { id: 2, imageUrl: '/event-auditorium.svg', title: 'Auditorium' },
        { id: 3, imageUrl: '/workshop-event.svg', title: 'Workshop' },
        { id: 4, imageUrl: '/group-photo.svg', title: 'Group Photo' },
        { id: 5, imageUrl: '/conference-event.svg', title: 'Conference' },
        { id: 6, imageUrl: '/sports-event.svg', title: 'Sports' }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto card"><p>Loading gallery...</p></div>
  }

  return (
    <div className="max-w-4xl mx-auto card">
      <h1 className="text-2xl mb-4">Gallery</h1>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.length > 0 ? (
          images.map((image) => (
            <div key={image.id} className="card">
              <img src={image.imageUrl} alt={image.title || 'gallery-image'} className="w-full rounded" />
              {image.title && <p className="mt-2 text-sm font-semibold">{image.title}</p>}
              {image.description && <p className="text-xs text-gray-600">{image.description}</p>}
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No images in gallery yet</p>
        )}
      </div>
    </div>
  )
}
