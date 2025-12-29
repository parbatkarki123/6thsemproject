import React from 'react'

export default function AuthForm({title, children, onSubmit, submitLabel}){
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">{title}</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        {children}
        <button type="submit" className="mt-2 bg-blue-600 text-white py-2 rounded">{submitLabel}</button>
      </form>
    </div>
  )
}
