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
      <header className="flex-shrink-0 bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-primary-600 p-1.5 sm:p-2 rounded-lg">
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
                  Options Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Screen stocks and options with advanced filters
                </p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/strategies"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  pathname === '/strategies'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Strategies
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

