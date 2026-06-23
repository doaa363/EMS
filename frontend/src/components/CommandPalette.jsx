import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Sparkles, LayoutDashboard, Users, Calendar, FileText, Settings, User, Shield, CornerDownLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const items = [
    { id: 'dashboard', label: 'Go to Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { id: 'profile', label: 'View My Profile', icon: <User size={18} />, path: '/profile' },
    { id: 'employees', label: 'Manage Employees', icon: <Users size={18} />, path: '/employees' },
    { id: 'attendance', label: 'Check Attendance Log', icon: <Calendar size={18} />, path: '/attendance' },
    { id: 'reports', label: 'View System Reports', icon: <FileText size={18} />, path: '/reports' },
    { id: 'settings', label: 'Open Settings', icon: <Settings size={18} />, path: '/settings' },
    ...(user?.role === 'manager' || user?.role === 'admin' ? [
      { id: 'audit', label: 'View System Audit Logs', icon: <Shield size={18} />, path: '/audit-logs' }
    ] : []),
  ]
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  )
  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(prev => (prev + 1) % filteredItems.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredItems[activeIndex]) {
          navigate(filteredItems[activeIndex].path)
          onClose()
        }
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredItems, activeIndex, navigate, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]">
      <div 
        className="w-full max-w-lg bg-white/90 border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input area */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 relative">
          <Search className="text-gray-400" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setActiveIndex(0)
            }}
          />
          <div className="flex items-center gap-1 bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-mono">
            ESC
          </div>
        </div>

        {/* Results area */}
        <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
          {filteredItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path)
                onClose()
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-left text-sm ${
                index === activeIndex
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/10'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={index === activeIndex ? 'text-white' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </div>
              {index === activeIndex && (
                <span className="text-xs flex items-center gap-0.5 bg-cyan-700 text-cyan-100 px-1.5 py-0.5 rounded">
                  <CornerDownLeft size={10} />
                  <span>Enter</span>
                </span>
              )}
            </button>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm flex flex-col items-center gap-2">
              <Sparkles size={20} className="text-cyan-500 animate-pulse" />
              <span>No commands found matching "{search}"</span>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-400 font-medium">
          <div className="flex gap-4">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span className="flex items-center gap-1">
            <Sparkles size={12} className="text-amber-500 animate-pulse" />
            <span>Magic Palette Console</span>
          </span>
        </div>
      </div>
    </div>
  )
}
export default CommandPalette
