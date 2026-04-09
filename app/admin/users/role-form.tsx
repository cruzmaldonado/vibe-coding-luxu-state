'use client'

import { useTransition } from 'react'
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value
    
    // Add confirmation
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      e.target.value = initialRole
      return
    }

    startTransition(async () => {
      const result = await updateUserRole(userId, newRole)
      if (!result.success) {
        alert(`Failed to update role: ${result.error}`)
      } else {
        alert('Role updated successfully')
      }
    })
  }

  return (
    <select
      disabled={disabled || isPending}
      defaultValue={initialRole}
      onChange={handleChange}
      className={`block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6
        ${disabled ? 'bg-slate-100 opacity-70 cursor-not-allowed' : 'bg-white'} 
        ${isPending ? 'animate-pulse' : ''}
      `}
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  )
}
