'use client'

import { useState } from 'react'
import { Stock, Option } from '@/types'
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Lightbulb, X, BarChart3 } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface StockTableProps {
  stocks: Stock[]
  options?: Option[]
}

export default function StockTable({ stocks, options = [] }: StockTableProps) {
  const [expandedStock, setExpandedStock] = useState<string | null>(null)
  const [selectedDirection, setSelectedDirection] = useState<{ symbol: string; direction: 'up' | 'down' } | null>(null)

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

  const getRelevantOptions = (symbol: string, direction: 'up' | 'down') => {
    const stockOptions = options.filter(opt => opt.underlying === symbol)
    
    if (direction === 'up') {
      // Bullish strategies: Calls, Bull spreads
      return stockOptions.filter(opt => opt.type === 'call')
    } else {
      // Bearish strategies: Puts, Bear spreads
      return stockOptions.filter(opt => opt.type === 'put')
    }
  }

  // Generate price history data for chart
  const generatePriceHistory = (stock: Stock) => {
    const days = 30
    const data = []
    const basePrice = stock.price
    const volatility = Math.abs(stock.changePercent) / 100 || 0.02
    
    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      // Generate realistic price movement
      const randomChange = (Math.random() - 0.5) * 2 * volatility
      const price = basePrice * (1 + randomChange * (days - i) / days)
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: Math.round(price * 100) / 100,
        volume: Math.floor(stock.volume * (0.7 + Math.random() * 0.6)),
      })
    }
    return data
  }

  const getRecommendedStrategies = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      return [
        { name: 'Long Call', description: 'Buy a call option. Unlimited upside potential, limited risk to premium paid.', risk: 'Limited', reward: 'Unlimited' },
        { name: 'Bull Call Spread', description: 'Buy lower strike call, sell higher strike call. Lower cost with capped upside.', risk: 'Limited', reward: 'Limited' },
        { name: 'Covered Call', description: 'Own stock and sell call. Generate income while limiting upside.', risk: 'Unlimited', reward: 'Limited' },
        { name: 'Bull Put Spread', description: 'Sell higher strike put, buy lower strike put. Collect premium if stock stays above.', risk: 'Limited', reward: 'Limited' },
      ]
    } else {
      return [
        { name: 'Long Put', description: 'Buy a put option. Profit if stock falls. Limited risk, high reward potential.', risk: 'Limited', reward: 'High' },
        { name: 'Bear Put Spread', description: 'Buy higher strike put, sell lower strike put. Defined risk and reward.', risk: 'Limited', reward: 'Limited' },
        { name: 'Bear Call Spread', description: 'Sell lower strike call, buy higher strike call. Profit if stock stays below.', risk: 'Limited', reward: 'Limited' },
        { name: 'Protective Put', description: 'Own stock and buy put as insurance. Protect downside while keeping upside.', risk: 'Limited', reward: 'Unlimited' },
      ]
    }
  }

  const handleDirectionSelect = (symbol: string, direction: 'up' | 'down') => {
    if (expandedStock === symbol && selectedDirection?.symbol === symbol && selectedDirection.direction === direction) {
      // Close if clicking the same
      setExpandedStock(null)
      setSelectedDirection(null)
    } else {
      setExpandedStock(symbol)
      setSelectedDirection({ symbol, direction })
    }
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
            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 w-8"></th>
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
          {stocks.map((stock) => {
            const isExpanded = expandedStock === stock.symbol
            const direction = selectedDirection?.symbol === stock.symbol ? selectedDirection.direction : null
            const relevantOptions = direction ? getRelevantOptions(stock.symbol, direction) : []
            const strategies = direction ? getRecommendedStrategies(direction) : []

            return (
              <>
                <tr
                  key={stock.symbol}
                  onClick={() => {
                    if (isExpanded) {
                      setExpandedStock(null)
                      setSelectedDirection(null)
                    } else {
                      setExpandedStock(stock.symbol)
                    }
                  }}
                  className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    )}
                  </td>
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
                
                {/* Expanded Row with Strategy Guide */}
                {isExpanded && (
                  <tr>
                    <td colSpan={10} className="p-0">
                      <div 
                        className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-t border-slate-200 dark:border-slate-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-6">
                          {!direction ? (
                            // Show direction selection prompts
                            <div className="space-y-6">
                              {/* Price Chart */}
                              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                                <div className="flex items-center gap-2 mb-4">
                                  <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {stock.symbol} Price Chart (30 Days)
                                  </h3>
                                </div>
                                <ResponsiveContainer width="100%" height={250}>
                                  <AreaChart data={generatePriceHistory(stock)}>
                                    <defs>
                                      <linearGradient id={`priceGradient-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={stock.change >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={stock.change >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0} />
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20 dark:opacity-10" vertical={false} />
                                    <XAxis 
                                      dataKey="date" 
                                      stroke="currentColor"
                                      className="text-slate-600 dark:text-slate-400"
                                      style={{ fontSize: '11px' }}
                                      tick={{ fill: 'currentColor' }}
                                    />
                                    <YAxis 
                                      stroke="currentColor"
                                      className="text-slate-600 dark:text-slate-400"
                                      style={{ fontSize: '11px' }}
                                      tick={{ fill: 'currentColor' }}
                                      domain={['auto', 'auto']}
                                    />
                                    <Tooltip
                                      content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                          const data = payload[0].payload
                                          return (
                                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-3">
                                              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                                                {data.date}
                                              </p>
                                              <p className={`text-lg font-bold ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                ${data.price.toFixed(2)}
                                              </p>
                                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                Volume: {formatVolume(data.volume)}
                                              </p>
                                            </div>
                                          )
                                        }
                                        return null
                                      }}
                                      cursor={{ stroke: stock.change >= 0 ? '#10b981' : '#ef4444', strokeWidth: 2, strokeDasharray: '5 5' }}
                                    />
                                    <Area
                                      type="monotone"
                                      dataKey="price"
                                      stroke={stock.change >= 0 ? '#10b981' : '#ef4444'}
                                      strokeWidth={2}
                                      fill={`url(#priceGradient-${stock.symbol})`}
                                      fillOpacity={0.6}
                                      dot={false}
                                      activeDot={{ 
                                        r: 4, 
                                        fill: stock.change >= 0 ? '#10b981' : '#ef4444',
                                        stroke: 'white',
                                        strokeWidth: 2
                                      }}
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                                <div className="mt-4 flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${stock.change >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                      <span className="text-slate-600 dark:text-slate-400">Current: {formatCurrency(stock.price)}</span>
                                    </div>
                                    <div className={`flex items-center gap-1 ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                      {stock.change >= 0 ? (
                                        <TrendingUp className="w-4 h-4" />
                                      ) : (
                                        <TrendingDown className="w-4 h-4" />
                                      )}
                                      <span className="font-semibold">
                                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                  What's your outlook for {stock.symbol}?
                                </h3>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                  onClick={() => handleDirectionSelect(stock.symbol, 'up')}
                                  className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-6 text-left hover:border-green-500 dark:hover:border-green-500 transition-all hover:shadow-lg"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="bg-green-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
                                      <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="text-lg font-bold text-green-800 dark:text-green-300 mb-2">
                                        I think the stock will go up
                                      </h4>
                                      <p className="text-sm text-green-700 dark:text-green-400">
                                        Recommended bullish strategies: Long Call, Bull Call Spread, Covered Call
                                      </p>
                                    </div>
                                  </div>
                                </button>
                                
                                <button
                                  onClick={() => handleDirectionSelect(stock.symbol, 'down')}
                                  className="group relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-6 text-left hover:border-red-500 dark:hover:border-red-500 transition-all hover:shadow-lg"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="bg-red-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
                                      <TrendingDown className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2">
                                        I think the stock will go down
                                      </h4>
                                      <p className="text-sm text-red-700 dark:text-red-400">
                                        Recommended bearish strategies: Long Put, Bear Put Spread, Protective Put
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Show strategies and options
                            <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${direction === 'up' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                    {direction === 'up' ? (
                                      <TrendingUp className={`w-5 h-5 ${direction === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                                    ) : (
                                      <TrendingDown className={`w-5 h-5 ${direction === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                      {direction === 'up' ? 'Bullish' : 'Bearish'} Strategies for {stock.symbol}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                      Based on your outlook that the stock will go {direction === 'up' ? 'up' : 'down'}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    setSelectedDirection(null)
                                  }}
                                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </button>
                              </div>

                              {/* Recommended Strategies */}
                              <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                  <Lightbulb className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                  Recommended Strategies
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {strategies.map((strategy) => (
                                    <div
                                      key={strategy.name}
                                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                      <div className="flex items-start justify-between mb-2">
                                        <h5 className="font-semibold text-slate-900 dark:text-white">{strategy.name}</h5>
                                        <span className={`text-xs px-2 py-1 rounded ${
                                          strategy.risk === 'Limited' 
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}>
                                          Risk: {strategy.risk}
                                        </span>
                                      </div>
                                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{strategy.description}</p>
                                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                        <span>Risk: {strategy.risk}</span>
                                        <span>Reward: {strategy.reward}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Available Options */}
                              {relevantOptions.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                                    Available {direction === 'up' ? 'Call' : 'Put'} Options ({relevantOptions.length})
                                  </h4>
                                  <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                    <div className="overflow-x-auto max-h-64 overflow-y-auto">
                                      <table className="w-full text-sm">
                                        <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0">
                                          <tr>
                                            <th className="text-left py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 text-xs">Strike</th>
                                            <th className="text-right py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 text-xs">Bid</th>
                                            <th className="text-right py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 text-xs">Ask</th>
                                            <th className="text-right py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 text-xs">Last</th>
                                            <th className="text-right py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 text-xs">Volume</th>
                                            <th className="text-right py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 text-xs">OI</th>
                                            <th className="text-right py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 text-xs">IV</th>
                                            <th className="text-left py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 text-xs">Expiry</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {relevantOptions.slice(0, 10).map((option, idx) => (
                                            <tr key={idx} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                              <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">{formatCurrency(option.strikePrice)}</td>
                                              <td className="py-2 px-3 text-right text-slate-700 dark:text-slate-300">{formatCurrency(option.bid)}</td>
                                              <td className="py-2 px-3 text-right text-slate-700 dark:text-slate-300">{formatCurrency(option.ask)}</td>
                                              <td className="py-2 px-3 text-right font-semibold text-slate-900 dark:text-white">{formatCurrency(option.lastPrice)}</td>
                                              <td className="py-2 px-3 text-right text-slate-700 dark:text-slate-300">{option.volume.toLocaleString()}</td>
                                              <td className="py-2 px-3 text-right text-slate-700 dark:text-slate-300">{option.openInterest.toLocaleString()}</td>
                                              <td className="py-2 px-3 text-right text-slate-700 dark:text-slate-300">{(option.impliedVolatility * 100).toFixed(1)}%</td>
                                              <td className="py-2 px-3 text-slate-700 dark:text-slate-300">
                                                {new Date(option.expirationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                    {relevantOptions.length > 10 && (
                                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 text-center text-xs text-slate-600 dark:text-slate-400">
                                        Showing 10 of {relevantOptions.length} options
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
