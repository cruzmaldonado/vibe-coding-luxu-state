import { createClient } from '@/lib/supabase/server'
import { RoleForm } from './role-form'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users, error } = await supabase
    .from('user_roles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Users & Roles</h1>
        <div className="text-red-500 bg-red-50 p-4 border border-red-200 rounded">
          Failed to load users: {error.message}
        </div>
      </div>
    )
  }

  // Also query the current active user to avoid them accidentally downgrading themselves
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">System Users</h1>
        <div className="text-sm text-slate-500">{users?.length || 0} registered users</div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">User ID</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users?.map((u) => {
               const isCurrentUser = currentUser?.id === u.user_id
               return (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500 break-all w-[240px]">
                    {u.user_id}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 group">
                    {u.email}
                    {isCurrentUser && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        You
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <RoleForm userId={u.user_id} initialRole={u.role} disabled={isCurrentUser} />
                  </td>
                </tr>
              )
            })}
            {users?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No users found in public.user_roles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
