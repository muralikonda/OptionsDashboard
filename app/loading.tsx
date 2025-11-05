export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 rounded-full animate-spin border-t-primary-600 dark:border-t-primary-400 mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary-300 dark:border-primary-700 rounded-full animate-spin border-t-primary-500 dark:border-t-primary-500 animate-reverse"></div>
          </div>
        </div>
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mt-4">
          Loading...
        </p>
      </div>
    </div>
  )
}

