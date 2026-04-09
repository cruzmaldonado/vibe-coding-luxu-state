'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

interface AdminNavbarProps {
  userAvatarUrl?: string | null
  userEmail?: string | null
}

const navLinks = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/properties', label: 'Properties' },
  { href: '/admin/users', label: 'Users' },
  { href: '/', label: '← Back to Site' },
]

export function AdminNavbar({ userAvatarUrl, userEmail }: AdminNavbarProps) {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const initials = userEmail
    ? userEmail.charAt(0).toUpperCase()
    : 'A'

  return (
    <nav className="bg-white border-b border-[#19322F]/5 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-10">
          <Link href="/admin" className="flex-shrink-0 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006655] text-2xl">apartment</span>
            <span className="font-bold text-lg text-[#19322F] tracking-tight">LuxeEstate</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isActive(link.href, link.exact)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    active
                      ? 'text-[#006655] bg-[#006655]/8'
                      : 'text-[#19322F]/60 hover:text-[#006655] hover:bg-[#006655]/5'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4/5 bg-[#006655] rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right: Actions + Avatar */}
        <div className="flex items-center gap-3">
          <button className="text-[#19322F]/50 hover:text-[#006655] transition-colors p-2 rounded-lg hover:bg-[#006655]/5">
            <span className="material-symbols-outlined text-xl">search</span>
          </button>
          <button className="text-[#19322F]/50 hover:text-[#006655] transition-colors relative p-2 rounded-lg hover:bg-[#006655]/5">
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2 ml-1 pl-3 border-l border-[#19322F]/10">
            <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-[#006655]/20 shadow-sm flex-shrink-0 flex items-center justify-center bg-[#19322F]/8">
              {userAvatarUrl ? (
                <Image
                  src={userAvatarUrl}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-sm font-bold text-[#006655]">{initials}</span>
              )}
            </div>
            {userEmail && (
              <span className="hidden lg:block text-xs text-[#19322F]/60 font-medium max-w-[120px] truncate">
                {userEmail}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
