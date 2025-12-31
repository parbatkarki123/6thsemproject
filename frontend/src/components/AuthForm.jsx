import React from 'react'

export default function AuthForm({title, children, onSubmit, submitLabel}){
  return (
    <div className="max-w-md mx-auto card">
      <h2 className="form-title">{title}</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        {children}
        <button type="submit" className="btn mt-2">{submitLabel}</button>
      </form>
    </div>
  )
}
