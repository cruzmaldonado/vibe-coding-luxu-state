import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { RoleForm } from './role-form'
import { AddUserModal } from './add-user-modal'

const PAGE_SIZE = 10

function getRoleBadge(role: string) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#19322F] text-white">
        Administrator
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#006655]/10 text-[#006655]">
      User
    </span>
  )
}

function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const showEllipsis = totalPages > 7

  let visiblePages = pages
  if (showEllipsis) {
    if (currentPage <= 4) {
      visiblePages = [...pages.slice(0, 5), -1, totalPages]
    } else if (currentPage >= totalPages - 3) {
      visiblePages = [1, -1, ...pages.slice(totalPages - 5)]
    } else {
      visiblePages = [1, -1, currentPage - 1, currentPage, currentPage + 1, -2, totalPages]
    }
  }

  return (
    <nav className="flex items-center gap-1" aria-label="Pagination">
      <Link
        href={`/admin/users?page=${currentPage - 1}`}
        aria-disabled={currentPage === 1}
        className={`flex items-center justify-center h-9 w-9 rounded-lg text-sm transition-all ${
          currentPage === 1
            ? 'pointer-events-none text-[#19322F]/20'
            : 'text-[#19322F]/60 hover:bg-[#006655]/10 hover:text-[#006655]'
        }`}
      >
        <span className="material-icons text-xl">chevron_left</span>
      </Link>

      {visiblePages.map((page, idx) =>
        page < 0 ? (
          <span key={`ellipsis-${idx}`} className="flex items-center justify-center h-9 w-9 text-[#19322F]/30 text-sm">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={`/admin/users?page=${page}`}
            className={`flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium transition-all ${
              page === currentPage
                ? 'bg-[#006655] text-white shadow-md shadow-[#006655]/20'
                : 'text-[#19322F]/60 hover:bg-[#006655]/10 hover:text-[#006655]'
            }`}
          >
            {page}
          </Link>
        )
      )}

      <Link
        href={`/admin/users?page=${currentPage + 1}`}
        aria-disabled={currentPage === totalPages}
        className={`flex items-center justify-center h-9 w-9 rounded-lg text-sm transition-all ${
          currentPage === totalPages
            ? 'pointer-events-none text-[#19322F]/20'
            : 'text-[#19322F]/60 hover:bg-[#006655]/10 hover:text-[#006655]'
        }`}
      >
        <span className="material-icons text-xl">chevron_right</span>
      </Link>
    </nav>
  )
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page || '1', 10))
  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data: users, error, count } = await supabase
    .from('user_roles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  const { data: { user: currentUser } } = await supabase.auth.getUser()

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <h1 className="text-3xl font-bold tracking-tight text-[#19322F] mb-6">User Directory</h1>
        <div className="text-red-500 bg-red-50 p-4 border border-red-200 rounded-lg">
          Failed to load users: {error.message}
        </div>
      </div>
    )
  }

  const totalCount = count || 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const rangeStart = from + 1
  const rangeEnd = Math.min(from + (users?.length || 0), totalCount)

  return (
    <>
      {/* Header */}
      <header className="w-full pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#19322F]">User Directory</h1>
            <p className="text-[#19322F]/60 mt-1 text-sm">Manage user access and roles for your properties.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-[#19322F]/40 group-focus-within:text-[#006655] text-xl">search</span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white text-[#19322F] shadow-sm placeholder-[#19322F]/30 focus:ring-2 focus:ring-[#006655] focus:bg-white transition-all text-sm"
                placeholder="Search by name, email..."
                type="text"
              />
            </div>
            <AddUserModal />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-8 flex gap-6 border-b border-[#19322F]/10 overflow-x-auto">
          <button className="pb-3 text-sm font-semibold text-[#006655] border-b-2 border-[#006655]">All Users</button>
          <button className="pb-3 text-sm font-medium text-[#19322F]/60 hover:text-[#19322F] transition-colors">Agents</button>
          <button className="pb-3 text-sm font-medium text-[#19322F]/60 hover:text-[#19322F] transition-colors">Brokers</button>
          <button className="pb-3 text-sm font-medium text-[#19322F]/60 hover:text-[#19322F] transition-colors">Admins</button>
        </div>
      </header>

      {/* User List */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-6 space-y-4">
        {/* Column Headers */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#19322F]/50 mb-2">
          <div className="col-span-4">User Details</div>
          <div className="col-span-3">Role &amp; Status</div>
          <div className="col-span-3">Info</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* User Cards */}
        {users?.map((u, index) => {
          const isCurrentUser = currentUser?.id === u.user_id
          const isActive = index === 0

          return (
            <div
              key={u.id}
              className={`group relative rounded-xl p-5 shadow-sm border flex flex-col md:grid md:grid-cols-12 gap-4 items-center transition-all duration-200
                ${isCurrentUser
                  ? 'bg-[#D9ECC8] border-transparent hover:shadow-md'
                  : 'bg-white border-gray-100 hover:bg-[#D9ECC8] hover:border-transparent hover:shadow-md'
                }`}
            >
              {/* User Details */}
              <div className="col-span-12 md:col-span-4 flex items-center w-full">
                <div className="relative flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-[#006655]/10 flex items-center justify-center border-2 border-white overflow-hidden">
                    <span className="material-symbols-outlined text-[#006655] text-2xl">person</span>
                  </div>
                  {u.role === 'admin' ? (
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
                  ) : (
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-blue-400 ring-2 ring-white"></span>
                  )}
                </div>
                <div className="ml-4 overflow-hidden">
                  <div className="text-sm font-bold text-[#19322F] truncate">
                    {u.email?.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'User'}
                    {isCurrentUser && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-white/60 px-2 py-0.5 text-xs font-medium text-[#19322F]/70">You</span>
                    )}
                  </div>
                  <div className="text-xs text-[#19322F]/70 truncate">{u.email}</div>
                  <div className="mt-1 text-[10px] px-2 py-0.5 inline-block bg-white/50 rounded text-[#19322F]/60">
                    ID: #{u.user_id?.substring(0, 8).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Role & Status */}
              <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
                {getRoleBadge(u.role)}
                <div className="flex items-center text-xs text-[#19322F]/60">
                  <span className="material-icons text-[14px] mr-1 text-[#006655]">check_circle</span>
                  Active
                </div>
              </div>

              {/* Info */}
              <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#19322F]/50">Joined</div>
                  <div className="text-sm font-semibold text-[#19322F]">
                    {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#19322F]/50">Access Level</div>
                  <div className="text-sm font-semibold text-[#19322F]">
                    {u.role === 'admin' ? 'Level 5' : 'Level 1'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-12 md:col-span-2 w-full flex justify-end">
                <RoleForm userId={u.user_id} initialRole={u.role} disabled={isCurrentUser} />
              </div>
            </div>
          )
        })}

        {users?.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center text-[#19322F]/40 shadow-sm border border-gray-100">
            No users found in public.user_roles.
          </div>
        )}
      </main>

      {/* Pagination Footer */}
      <footer className="border-t border-[#19322F]/5 bg-[#EEF6F6] py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#19322F]/60">
            {totalCount > 0 ? (
              <>
                Showing{' '}
                <span className="font-semibold text-[#19322F]">{rangeStart}</span>
                {' – '}
                <span className="font-semibold text-[#19322F]">{rangeEnd}</span>
                {' of '}
                <span className="font-semibold text-[#19322F]">{totalCount}</span>
                {' users'}
              </>
            ) : (
              'No users found'
            )}
          </p>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </footer>
    </>
  )
}
