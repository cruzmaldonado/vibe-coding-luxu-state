'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { updateUserRole } from './actions'

export function RoleForm({
  userId,
  initialRole,
  disabled
}: {
  userId: string
  initialRole: string
  disabled?: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRoleChange = (newRole: string) => {
    setIsOpen(false)
    if (newRole === initialRole || disabled || isPending) return

    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return

    startTransition(async () => {
      const result = await updateUserRole(userId, newRole)
      if (!result.success) {
        alert(`Failed to update role: ${result.error}`)
      }
    })
  }

  const isAdmin = initialRole === 'admin'

  return (
    <div className="relative w-full md:w-auto" ref={menuRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled || isPending}
        className={`inline-flex items-center px-4 py-2 text-xs font-medium rounded-lg focus:outline-none transition-colors w-full md:w-auto justify-center
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isPending ? 'animate-pulse' : ''}
          ${isAdmin
            ? 'bg-[#006655] text-white shadow-md hover:bg-[#004d40]'
            : 'border border-[#19322F]/10 bg-white shadow-sm text-[#19322F] hover:bg-[#19322F] hover:text-white'
          }`}
      >
        {isPending ? 'Updating...' : 'Change Role'}
        <span className="material-icons text-[16px] ml-2">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg bg-[#006655] ring-1 ring-black ring-opacity-5 overflow-hidden z-50 origin-top-right">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => handleRoleChange('admin')}
              className={`w-full text-left group flex items-center px-4 py-3 text-xs transition-colors
                ${initialRole === 'admin' ? 'bg-white/10 text-white font-medium' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
              role="menuitem"
            >
              <span className="material-icons text-sm mr-3 text-white/70">shield</span>
              Administrator
            </button>
            <button
              onClick={() => handleRoleChange('user')}
              className={`w-full text-left group flex items-center px-4 py-3 text-xs transition-colors
                ${initialRole === 'user' ? 'bg-white/10 text-white font-medium' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
              role="menuitem"
            >
              <span className="material-icons text-sm mr-3 text-white/70">person</span>
              User
            </button>
            <div className="border-t border-white/10 my-1"></div>
            <button
              className="w-full text-left group flex items-center px-4 py-3 text-xs text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-colors"
              role="menuitem"
              disabled
            >
              <span className="material-icons text-sm mr-3 text-red-300">block</span>
              Suspend User
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
