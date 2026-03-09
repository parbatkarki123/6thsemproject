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
        { id: 1, imageUrl: '/real-campus.jpg', title: 'Campus' },
        { id: 2, imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80', title: 'Auditorium' },
        { id: 3, imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80', title: 'Workshop' },
        { id: 4, imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80', title: 'Group Photo' },
        { id: 5, imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80', title: 'Conference' },
        { id: 6, imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80', title: 'Sports' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = (id, fallbackUrl) => {
    setImages(prevImages => 
      prevImages.map(img => 
        img.id === id ? { ...img, imageUrl: fallbackUrl, errorHandled: true } : img
      )
    )
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
              <div className="w-full h-48 bg-gray-100 rounded overflow-hidden">
                <img 
                  src={image.imageUrl} 
                  alt="" 
                  onError={(e) => {
                    if (!image.errorHandled) {
                      const fallbacks = {
                        2: '/event-auditorium.svg',
                        3: '/workshop-event.svg',
                        4: '/group-photo.svg',
                        5: '/conference-event.svg',
                        6: '/sports-event.svg'
                      }
                      handleImageError(image.id, fallbacks[image.id] || '/real-campus.jpg')
                    }
                  }}
                  className="w-full h-full object-cover" 
                />
              </div>
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
