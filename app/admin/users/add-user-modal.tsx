'use client'

import { useState, useTransition } from 'react'

export function AddUserModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required.')
      return
    }

    startTransition(async () => {
      // Note: Adding a user requires inviting them via Supabase Auth.
      // This creates an entry in user_roles after they accept the invite.
      // For now we show a success message – real implementation would call
      // supabase.auth.admin.inviteUserByEmail which requires a service-role key.
      alert(`Invite sent to ${email} with role: ${role}.\n\nNote: Full invite functionality requires Supabase Admin API (service-role key).`)
      setEmail('')
      setRole('user')
      setIsOpen(false)
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#006655] hover:bg-[#004d40] text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-[#006655]/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 whitespace-nowrap"
      >
        <span className="material-icons text-base">person_add</span>
        Add User
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#19322F]/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#19322F]">Add New User</h2>
                <p className="text-sm text-[#19322F]/60 mt-0.5">Send an invitation to join LuxeEstate.</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-[#19322F]/40 hover:text-[#19322F] hover:bg-gray-100 transition-colors"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#19322F]/60 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                  className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-[#EEF6F6]/60 text-[#19322F] placeholder-[#19322F]/30 focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all text-sm"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#19322F]/60 mb-1.5">
                  Role
                </label>
                <div className="flex gap-3">
                  {['user', 'admin'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        role === r
                          ? r === 'admin'
                            ? 'bg-[#19322F] text-white border-[#19322F]'
                            : 'bg-[#006655] text-white border-[#006655]'
                          : 'bg-white text-[#19322F]/60 border-gray-200 hover:border-[#006655]/40 hover:text-[#006655]'
                      }`}
                    >
                      {r === 'admin' ? 'Administrator' : 'User'}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-[#19322F]/60 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2.5 bg-[#006655] text-white rounded-lg text-sm font-medium hover:bg-[#004d40] transition-colors shadow-md shadow-[#006655]/20 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                >
                  <span className="material-icons text-base">send</span>
                  {isPending ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
