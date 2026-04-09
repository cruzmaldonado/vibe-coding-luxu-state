import Link from 'next/link'
import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#EEF6F6] font-[Inter,sans-serif] text-[#19322F]">
      {/* Material Icons */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />

      {/* Top Navbar */}
      <nav className="bg-white border-b border-[#19322F]/5 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-12">
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006655] text-2xl">apartment</span>
              <span className="font-bold text-lg text-[#19322F] tracking-tight">LuxeEstate</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/admin" className="text-[#19322F]/60 hover:text-[#006655] px-1 py-2 text-sm font-medium transition-colors">Dashboard</Link>
              <Link href="/admin/properties" className="text-[#19322F]/60 hover:text-[#006655] px-1 py-2 text-sm font-medium transition-colors">Properties</Link>
              <Link href="/admin/users" className="text-[#19322F]/60 hover:text-[#006655] px-1 py-2 text-sm font-medium transition-colors">Users</Link>
              <Link href="/" className="text-[#19322F]/60 hover:text-[#006655] px-1 py-2 text-sm font-medium transition-colors">← Back to Site</Link>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button className="text-[#19322F]/60 hover:text-[#006655] transition-colors">
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
            <button className="text-[#19322F]/60 hover:text-[#006655] transition-colors relative">
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <button className="flex items-center gap-2 ml-2">
              <div className="h-8 w-8 rounded-full bg-[#19322F]/10 flex items-center justify-center overflow-hidden border border-[#19322F]/10">
                <span className="material-symbols-outlined text-[#19322F]/60 text-lg">person</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full">
        {children}
      </main>
    </div>
  )
}
