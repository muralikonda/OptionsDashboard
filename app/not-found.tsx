import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 mb-4">
            <Search className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-6xl font-extrabold text-slate-900 dark:text-white mb-2">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
            Page Not Found
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Home className="w-4 h-4" />
          Go back home
        </Link>
      </div>
    </div>
  )
}

