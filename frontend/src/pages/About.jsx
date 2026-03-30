import React from 'react'

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 fade-up">
        <h1 className="text-4xl font-bold title-accent inline-block">About Our College</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto pt-4">
          A legacy of excellence in education, fostering innovation and community through vibrant campus life.
        </p>
      </section>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8">
        <section className="card space-y-3 fade-up">
          <h2 className="text-2xl font-semibold text-accent">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            To provide a transformative educational experience that empowers students with knowledge, skills, and values to lead and serve in a global society.
          </p>
        </section>
        <section className="card space-y-3 fade-up">
          <h2 className="text-2xl font-semibold text-accent">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            To be a premier institution of higher learning recognized globally for excellence in teaching, research, and fostering a culture of continuous improvement.
          </p>
        </section>
      </div>

      {/* Core Values */}
      <section className="card section fade-up">
        <h2 className="text-2xl font-semibold mb-6">Core Values</h2>
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="text-3xl">🎓</div>
            <h3 className="font-bold">Academic Integrity</h3>
            <p className="text-sm text-gray-600">Upholding the highest standards of honesty and ethical behavior.</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">🤝</div>
            <h3 className="font-bold">Community</h3>
            <p className="text-sm text-gray-600">Building a supportive and inclusive environment for all.</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">💡</div>
            <h3 className="font-bold">Innovation</h3>
            <p className="text-sm text-gray-600">Encouraging creative thinking and new approaches to learning.</p>
          </div>
        </div>
      </section>

      {/* Campus Life & Events */}
      <section className="flex flex-col md:flex-row gap-8 items-center fade-up">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-semibold">Vibrant Campus Life</h2>
          <p className="text-gray-700 leading-relaxed">
            Beyond the classroom, our college is a hub of activity. From technical workshops and academic conferences to sports tournaments and cultural festivals, there's always something happening. 
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our Event Management Portal is designed to keep you connected with these opportunities, making it easier than ever to register, participate, and celebrate your achievements.
          </p>
        </div>
        <div className="w-full md:w-1/3 overflow-hidden rounded-lg shadow-lg">
          <img 
            src="/real-campus.jpg" 
            alt="Campus Life" 
            className="w-full h-64 object-cover"
          />
        </div>
      </section>

      {/* Contact Quick Info */}
      <section className="text-center space-y-4 py-8 border-t border-gray-200 fade-up">
        <h2 className="text-2xl font-semibold">Join Our Community</h2>
        <p className="text-gray-600">Have questions about upcoming events? Reach out to us.</p>
        <div className="flex justify-center gap-6 text-sm font-medium">
          <span>📧 events@college.edu</span>
          <span>📞 025-152645</span>
          <span>📍 Itahari, Nepal</span>
        </div>
      </section>
    </div>
  )
}
