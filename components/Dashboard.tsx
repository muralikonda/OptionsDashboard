'use client'

import { ReactNode } from 'react'
import { TrendingUp, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DashboardProps {
  children: ReactNode
}

export default function Dashboard({ children }: DashboardProps) {
  const pathname = usePathname()

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="flex-shrink-0 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 shadow-xl border-b-2 border-primary-700 dark:border-slate-700">
        <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-2.5 rounded-xl shadow-lg">
                <TrendingUp className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white drop-shadow-lg">
                  Options Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-primary-100 dark:text-slate-300 font-medium">
                  📊 Screen stocks and options with advanced filters & pattern analysis
                </p>
              </div>
            </div>
            <nav className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/"
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  pathname === '/'
                    ? 'bg-white text-primary-600 shadow-lg scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <span className="hidden sm:inline">📈 Dashboard</span>
                <span className="sm:hidden">📈</span>
              </Link>
              <Link
                href="/strategies"
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  pathname === '/strategies'
                    ? 'bg-white text-primary-600 shadow-lg scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Strategies</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-hidden w-full">
        {children}
      </div>
    </div>
  )
}

