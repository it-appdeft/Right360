import { useState, useEffect, useCallback } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa'
import { create } from 'zustand'

const useToastStore = create((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { id: Date.now(), ...toast }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

export const toast = {
  success: (message) => useToastStore.getState().addToast({ type: 'success', message }),
  error: (message) => useToastStore.getState().addToast({ type: 'error', message }),
  info: (message) => useToastStore.getState().addToast({ type: 'info', message }),
}

const icons = {
  success: <FaCheckCircle className="text-success" />,
  error: <FaExclamationCircle className="text-danger" />,
  info: <FaInfoCircle className="text-info" />,
}

const bgColors = {
  success: 'bg-success/10 border-success/30',
  error: 'bg-danger/10 border-danger/30',
  info: 'bg-info/10 border-info/30',
}

function ToastItem({ toast: t, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(t.id), 4000)
    return () => clearTimeout(timer)
  }, [t.id, onRemove])

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-card border shadow-card ${bgColors[t.type]}`}>
      {icons[t.type]}
      <span className="text-sm text-text-primary flex-1">{t.message}</span>
      <button onClick={() => onRemove(t.id)} className="text-text-muted hover:text-text-primary">
        <FaTimes size={12} />
      </button>
    </div>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useToastStore()
  const handleRemove = useCallback((id) => removeToast(id), [removeToast])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-[200] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={handleRemove} />
      ))}
    </div>
  )
}

export default ToastContainer
