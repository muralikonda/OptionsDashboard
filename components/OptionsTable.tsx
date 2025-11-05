import { Option } from '@/types'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface OptionsTableProps {
  options: Option[]
}

export default function OptionsTable({ options }: OptionsTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (options.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        No options match the selected filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto h-full -mx-2 sm:mx-0">
      <table className="w-full min-w-[1000px]">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Symbol</th>
            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden md:table-cell">Underlying</th>
            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Type</th>
            <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Strike</th>
            <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden lg:table-cell">Bid</th>
            <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden lg:table-cell">Ask</th>
            <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Last</th>
            <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden sm:table-cell">Volume</th>
            <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden lg:table-cell">OI</th>
            <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden md:table-cell">IV</th>
            <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden xl:table-cell">Delta</th>
            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Expiry</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option, index) => (
            <tr
              key={`${option.symbol}-${index}`}
              className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td className="py-2 sm:py-3 px-2 sm:px-4">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">{option.symbol}</span>
                  <div className="md:hidden text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {option.underlying}
                  </div>
                </div>
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 text-slate-700 dark:text-slate-300 hidden md:table-cell text-xs sm:text-sm">
                {option.underlying}
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4">
                <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-semibold ${
                  option.type === 'call'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {option.type === 'call' ? (
                    <ArrowUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  ) : (
                    <ArrowDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  )}
                  {option.type.toUpperCase()}
                </span>
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                {formatCurrency(option.strikePrice)}
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden lg:table-cell">
                {formatCurrency(option.bid)}
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden lg:table-cell">
                {formatCurrency(option.ask)}
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                {formatCurrency(option.lastPrice)}
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden sm:table-cell">
                {option.volume.toLocaleString()}
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden lg:table-cell">
                {option.openInterest.toLocaleString()}
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden md:table-cell">
                {(option.impliedVolatility * 100).toFixed(1)}%
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 text-right hidden xl:table-cell">
                <span className={`font-semibold text-xs sm:text-sm ${
                  option.delta >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {option.delta >= 0 ? '+' : ''}{option.delta.toFixed(2)}
                </span>
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                {formatDate(option.expirationDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

