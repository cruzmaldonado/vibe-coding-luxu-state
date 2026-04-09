import { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { AdminNavbar } from './AdminNavbar'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Try to get avatar from user metadata (works with Google OAuth, etc.)
  const avatarUrl: string | null =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null

  return (
    <div className="flex flex-col min-h-screen bg-[#EEF6F6] font-[Inter,sans-serif] text-[#19322F]">
      {/* Material Icons */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />

      <AdminNavbar
        userAvatarUrl={avatarUrl}
        userEmail={user?.email}
      />

      {/* Main Content */}
      <main className="flex-grow w-full">
        {children}
      </main>
    </div>
  )
}
