import { Stock } from '@/types'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StockTableProps {
  stocks: Stock[]
}

export default function StockTable({ stocks }: StockTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`
    }
    if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`
    }
    return `$${value.toFixed(2)}`
  }

  const formatVolume = (value: number) => {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`
    }
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`
    }
    return value.toLocaleString()
  }

  if (stocks.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        No stocks match the selected filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto h-full">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Symbol</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Name</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Price</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Change</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Volume</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Market Cap</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Sector</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">P/E</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Yield</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr
              key={stock.symbol}
              className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td className="py-3 px-4">
                <span className="font-semibold text-slate-900 dark:text-white">{stock.symbol}</span>
              </td>
              <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{stock.name}</td>
              <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-white">
                {formatCurrency(stock.price)}
              </td>
              <td className="py-3 px-4 text-right">
                <div className={`flex items-center justify-end gap-1 ${
                  stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {stock.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-semibold">
                    {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                {formatVolume(stock.volume)}
              </td>
              <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                {formatNumber(stock.marketCap)}
              </td>
              <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{stock.sector}</td>
              <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                {stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A'}
              </td>
              <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                {stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

