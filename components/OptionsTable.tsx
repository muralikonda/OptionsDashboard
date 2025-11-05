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
    <div className="overflow-x-auto h-full">
      <table className="w-full min-w-[1200px]">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Symbol</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Underlying</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Type</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Strike</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Bid</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Ask</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Last</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Volume</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Open Interest</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">IV</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Delta</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Expiration</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option, index) => (
            <tr
              key={`${option.symbol}-${index}`}
              className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td className="py-3 px-4">
                <span className="font-semibold text-slate-900 dark:text-white">{option.symbol}</span>
              </td>
              <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{option.underlying}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                  option.type === 'call'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {option.type === 'call' ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  {option.type.toUpperCase()}
                </span>
              </td>
              <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-white">
                {formatCurrency(option.strikePrice)}
              </td>
              <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                {formatCurrency(option.bid)}
              </td>
              <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                {formatCurrency(option.ask)}
              </td>
              <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-white">
                {formatCurrency(option.lastPrice)}
              </td>
              <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                {option.volume.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                {option.openInterest.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                {(option.impliedVolatility * 100).toFixed(2)}%
              </td>
              <td className="py-3 px-4 text-right">
                <span className={`font-semibold ${
                  option.delta >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {option.delta >= 0 ? '+' : ''}{option.delta.toFixed(2)}
                </span>
              </td>
              <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                {formatDate(option.expirationDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

