import Link from 'next/link'
import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-bold text-slate-800">
            Luxe Admin
          </Link>
        </div>
        <nav className="mt-6 flex flex-col gap-1 px-4">
          <Link 
            href="/admin/properties"
            className="px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-100"
          >
            Properties
          </Link>
          <Link 
            href="/admin/users"
            className="px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-100"
          >
            Users & Roles
          </Link>
          <Link 
            href="/"
            className="px-4 py-2 mt-8 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            &larr; Back to Site
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
