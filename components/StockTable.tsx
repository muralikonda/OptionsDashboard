'use client'

import { useState } from 'react'
import React from 'react'
import { Stock, Option } from '@/types'
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Lightbulb, X, BarChart3, TrendingUp as UpTrend, TrendingDown as DownTrend } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { detectChartPatterns, analyzePriceAction, ChartPattern, PriceAction } from '@/utils/patternDetection'

interface StockTableProps {
  stocks: Stock[]
  options?: Option[]
}

interface PatternAnalysisViewProps {
  stock: Stock
  patterns: ChartPattern[]
  priceAction: PriceAction
  priceHistory: Array<{ date: string; price: number; volume: number }>
  formatCurrency: (value: number) => string
  formatVolume: (value: number) => string
  handleDirectionSelect: (symbol: string, direction: 'up' | 'down') => void
}

function PatternAnalysisView({ 
  stock, 
  patterns, 
  priceAction, 
  priceHistory, 
  formatCurrency, 
  formatVolume, 
  handleDirectionSelect 
}: PatternAnalysisViewProps) {
  return (
    <div className="space-y-6">
      {/* Price Chart with Pattern Analysis */}
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-xl shadow-lg">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {stock.symbol} Price Chart
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">30-day price history with pattern analysis</p>
              </div>
            </div>
            {/* Price Action Summary */}
            <div className="flex flex-wrap items-center gap-2">
              {priceAction.trend === 'uptrend' && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-shadow">
                  <UpTrend className="w-3.5 h-3.5" />
                  Uptrend
                </span>
              )}
              {priceAction.trend === 'downtrend' && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-shadow">
                  <DownTrend className="w-3.5 h-3.5" />
                  Downtrend
                </span>
              )}
              {priceAction.trend === 'sideways' && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-full text-xs font-bold shadow-md">
                  ➡️ Sideways
                </span>
              )}
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${
                priceAction.volatility === 'low' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : priceAction.volatility === 'high'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-gradient-to-r from-slate-500 to-slate-600 text-white'
              }`}>
                {priceAction.volatility === 'low' ? '🔵' : priceAction.volatility === 'high' ? '🔴' : '🟡'} {priceAction.volatility.charAt(0).toUpperCase() + priceAction.volatility.slice(1)}
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
            <AreaChart data={priceHistory}>
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
              {/* Support Levels */}
              {priceAction.supportLevels.map((level, idx) => (
                <ReferenceLine
                  key={`support-${idx}`}
                  y={level}
                  stroke="#10b981"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  label={{ value: `S${idx + 1}`, position: 'right', style: { fontSize: '10px', fill: '#10b981' } }}
                />
              ))}
              {/* Resistance Levels */}
              {priceAction.resistanceLevels.map((level, idx) => (
                <ReferenceLine
                  key={`resistance-${idx}`}
                  y={level}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  label={{ value: `R${idx + 1}`, position: 'right', style: { fontSize: '10px', fill: '#ef4444' } }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Detected Patterns */}
        {patterns.length > 0 && (
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-lg p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Detected Chart Patterns
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {patterns.length} pattern{patterns.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {patterns.map((pattern, idx) => (
                <div
                  key={idx}
                  className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                    pattern.signal === 'bullish'
                      ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-green-800/30 border-green-300 dark:border-green-700 shadow-green-200/50 dark:shadow-green-900/20'
                      : pattern.signal === 'bearish'
                      ? 'bg-gradient-to-br from-red-50 via-rose-50 to-red-100 dark:from-red-900/30 dark:via-rose-900/20 dark:to-red-800/30 border-red-300 dark:border-red-700 shadow-red-200/50 dark:shadow-red-900/20'
                      : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-700/50 dark:via-slate-800/50 dark:to-slate-700/50 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {/* Confidence Badge */}
                  <div className="absolute top-2 right-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-bold shadow-md ${
                      pattern.confidence >= 0.7
                        ? 'bg-emerald-500 text-white'
                        : pattern.confidence >= 0.5
                        ? 'bg-yellow-500 text-white'
                        : 'bg-slate-400 text-white'
                    }`}>
                      {Math.round(pattern.confidence * 100)}%
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${
                        pattern.signal === 'bullish'
                          ? 'bg-green-500 text-white'
                          : pattern.signal === 'bearish'
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-500 text-white'
                      }`}>
                        {pattern.signal === 'bullish' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : pattern.signal === 'bearish' ? (
                          <TrendingDown className="w-4 h-4" />
                        ) : (
                          <BarChart3 className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                          {pattern.type}
                        </h5>
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold ${
                          pattern.signal === 'bullish'
                            ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                            : pattern.signal === 'bearish'
                            ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                            : 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200'
                        }`}>
                          {pattern.signal === 'bullish' ? '📈' : pattern.signal === 'bearish' ? '📉' : '➡️'} {pattern.signal.charAt(0).toUpperCase() + pattern.signal.slice(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                      {pattern.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            pattern.confidence >= 0.7
                              ? 'bg-emerald-500'
                              : pattern.confidence >= 0.5
                              ? 'bg-yellow-500'
                              : 'bg-slate-400'
                          }`}
                          style={{ width: `${pattern.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        {Math.round(pattern.confidence * 100)}% match
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Action Details */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-xl border-2 border-blue-200 dark:border-slate-700 shadow-lg p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Price Action Analysis
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Key support and resistance levels
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-green-200 dark:border-green-800/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-bold text-green-700 dark:text-green-400">
                  Support Levels
                </p>
              </div>
              <div className="space-y-2">
                {priceAction.supportLevels.length > 0 ? (
                  priceAction.supportLevels.map((level, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Support</span>
                      </div>
                      <span className="font-bold text-green-600 dark:text-green-400 text-base">
                        ${level.toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">No clear support levels detected</p>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-red-200 dark:border-red-800/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-bold text-red-700 dark:text-red-400">
                  Resistance Levels
                </p>
              </div>
              <div className="space-y-2">
                {priceAction.resistanceLevels.length > 0 ? (
                  priceAction.resistanceLevels.map((level, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Resistance</span>
                      </div>
                      <span className="font-bold text-red-600 dark:text-red-400 text-base">
                        ${level.toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">No clear resistance levels detected</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-900/20 dark:via-yellow-900/10 dark:to-amber-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-800/30 p-4 sm:p-5 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-2.5 rounded-xl shadow-lg">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              What's your outlook for {stock.symbol}?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Select your market direction to see recommended strategies
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleDirectionSelect(stock.symbol, 'up')}
            className="group relative overflow-hidden bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 dark:from-green-600 dark:via-emerald-600 dark:to-green-700 border-2 border-green-300 dark:border-green-500 rounded-xl p-5 sm:p-6 text-left active:scale-[0.98] transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/50 hover:-translate-y-1 touch-manipulation"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-start gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg sm:text-xl font-bold text-white">
                    I think the stock will go up
                  </h4>
                  <span className="text-2xl">📈</span>
                </div>
                <p className="text-sm text-green-100 dark:text-green-200 leading-relaxed">
                  Recommended bullish strategies: Long Call, Bull Call Spread, Covered Call
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-green-100 font-medium">
                  <span className="px-2 py-1 bg-white/20 rounded">Bullish</span>
                  <span>→</span>
                  <span>Potential upside</span>
                </div>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => handleDirectionSelect(stock.symbol, 'down')}
            className="group relative overflow-hidden bg-gradient-to-br from-red-400 via-rose-500 to-red-600 dark:from-red-600 dark:via-rose-600 dark:to-red-700 border-2 border-red-300 dark:border-red-500 rounded-xl p-5 sm:p-6 text-left active:scale-[0.98] transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/50 hover:-translate-y-1 touch-manipulation"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-start gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0">
                <TrendingDown className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg sm:text-xl font-bold text-white">
                    I think the stock will go down
                  </h4>
                  <span className="text-2xl">📉</span>
                </div>
                <p className="text-sm text-red-100 dark:text-red-200 leading-relaxed">
                  Recommended bearish strategies: Long Put, Bear Put Spread, Protective Put
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-red-100 font-medium">
                  <span className="px-2 py-1 bg-white/20 rounded">Bearish</span>
                  <span>→</span>
                  <span>Downside protection</span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
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

  // Get patterns and price action for a stock
  const getStockAnalysis = (stock: Stock) => {
    const priceHistory = generatePriceHistory(stock)
    const patterns = detectChartPatterns(priceHistory)
    const priceAction = analyzePriceAction(priceHistory)
    return { patterns, priceAction, priceHistory }
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
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 mb-4">
          <BarChart3 className="w-10 h-10 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No stocks found</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">Try adjusting your filters or check if data is loading.</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium">
          <span>💡</span>
          <span>Try removing some filters to see more results</span>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto h-full -mx-2 sm:mx-0">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 w-6 sm:w-8 text-xs sm:text-sm"></th>
            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Symbol</th>
            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden md:table-cell">Name</th>
            <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Price</th>
            <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Change</th>
            <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden lg:table-cell">Volume</th>
            <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden xl:table-cell">Market Cap</th>
            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden lg:table-cell">Sector</th>
            <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden xl:table-cell">P/E</th>
            <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden xl:table-cell">Yield</th>
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
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent dark:hover:from-primary-900/10 dark:hover:to-transparent transition-all duration-200 cursor-pointer active:bg-slate-100 dark:active:bg-slate-700 group"
                >
                  <td className="py-2 sm:py-3 px-2 sm:px-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
                      )}
                    </div>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white font-bold text-sm shadow-md">
                        {stock.symbol.substring(0, 2)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{stock.symbol}</span>
                        <div className="md:hidden text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[120px]">
                          {stock.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-slate-700 dark:text-slate-300 hidden md:table-cell text-sm">
                    {stock.name}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {formatCurrency(stock.price)}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${
                      stock.change >= 0 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {stock.change >= 0 ? (
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      ) : (
                        <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      )}
                      <span className="font-bold text-xs sm:text-sm">
                        <span className="hidden sm:inline">{stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)} </span>
                        <span>({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden lg:table-cell">
                    {formatVolume(stock.volume)}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden xl:table-cell">
                    {formatNumber(stock.marketCap)}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden lg:table-cell">
                    {stock.sector}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden xl:table-cell">
                    {stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A'}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden xl:table-cell">
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
                        <div className="p-3 sm:p-4 lg:p-6">
                          {!direction ? (
                            // Show direction selection prompts
                            (() => {
                              const { patterns, priceAction, priceHistory } = getStockAnalysis(stock)
                              return (
                                <PatternAnalysisView 
                                  stock={stock}
                                  patterns={patterns}
                                  priceAction={priceAction}
                                  priceHistory={priceHistory}
                                  formatCurrency={formatCurrency}
                                  formatVolume={formatVolume}
                                  handleDirectionSelect={handleDirectionSelect}
                                />
                              )
                            })()
                          ) : (
                            // Show strategies and options
                            <div className="space-y-6">
                              <div className="bg-gradient-to-r from-primary-50 via-primary-100 to-primary-50 dark:from-primary-900/30 dark:via-primary-800/30 dark:to-primary-900/30 rounded-xl border-2 border-primary-200 dark:border-primary-800/30 p-4 sm:p-5 shadow-lg">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl shadow-lg ${direction === 'up' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}>
                                      {direction === 'up' ? (
                                        <TrendingUp className="w-6 h-6 text-white" />
                                      ) : (
                                        <TrendingDown className="w-6 h-6 text-white" />
                                      )}
                                    </div>
                                    <div>
                                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                        {direction === 'up' ? '📈 Bullish' : '📉 Bearish'} Strategies for {stock.symbol}
                                      </h3>
                                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                        Based on your outlook that the stock will go {direction === 'up' ? 'up' : 'down'}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setSelectedDirection(null)
                                    }}
                                    className="p-2.5 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-xl transition-all hover:scale-110 shadow-md"
                                  >
                                    <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                  </button>
                                </div>
                              </div>

                              {/* Recommended Strategies */}
                              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-indigo-200 dark:border-indigo-800/30 shadow-lg p-4 sm:p-5">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
                                    <Lightbulb className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                                      Recommended Strategies
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                      Based on your {direction === 'up' ? 'bullish' : 'bearish'} outlook
                                    </p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                  {strategies.map((strategy) => (
                                    <div
                                      key={strategy.name}
                                      className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 group"
                                    >
                                      <div className="flex items-start justify-between mb-3">
                                        <h5 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{strategy.name}</h5>
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold shadow-sm ${
                                          strategy.risk === 'Limited' 
                                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                                            : strategy.risk === 'Unlimited'
                                            ? 'bg-gradient-to-r from-red-400 to-rose-500 text-white'
                                            : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                                        }`}>
                                          {strategy.risk}
                                        </span>
                                      </div>
                                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">{strategy.description}</p>
                                      <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center gap-2 text-xs">
                                          <span className="text-slate-500 dark:text-slate-400">Risk:</span>
                                          <span className="font-semibold text-slate-700 dark:text-slate-300">{strategy.risk}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                          <span className="text-slate-500 dark:text-slate-400">Reward:</span>
                                          <span className="font-semibold text-slate-700 dark:text-slate-300">{strategy.reward}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Available Options */}
                              {relevantOptions.length > 0 && (
                                <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-900/20 dark:via-cyan-900/20 dark:to-blue-900/20 rounded-xl border-2 border-teal-200 dark:border-teal-800/30 shadow-lg p-4 sm:p-5">
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-2.5 rounded-xl shadow-lg">
                                      <BarChart3 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                                        Available {direction === 'up' ? 'Call' : 'Put'} Options
                                      </h4>
                                      <p className="text-xs text-slate-600 dark:text-slate-400">
                                        {relevantOptions.length} contract{relevantOptions.length !== 1 ? 's' : ''} found
                                      </p>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-teal-200 dark:border-teal-800/30 overflow-hidden shadow-inner">
                                    <div className="overflow-x-auto max-h-64 overflow-y-auto">
                                      <table className="w-full text-sm">
                                        <thead className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 sticky top-0 z-10">
                                          <tr>
                                            <th className="text-left py-3 px-4 font-bold text-slate-700 dark:text-slate-300 text-xs">Strike</th>
                                            <th className="text-right py-3 px-4 font-bold text-slate-700 dark:text-slate-300 text-xs">Bid</th>
                                            <th className="text-right py-3 px-4 font-bold text-slate-700 dark:text-slate-300 text-xs">Ask</th>
                                            <th className="text-right py-3 px-4 font-bold text-slate-700 dark:text-slate-300 text-xs">Last</th>
                                            <th className="text-right py-3 px-4 font-bold text-slate-700 dark:text-slate-300 text-xs">Volume</th>
                                            <th className="text-right py-3 px-4 font-bold text-slate-700 dark:text-slate-300 text-xs">OI</th>
                                            <th className="text-right py-3 px-4 font-bold text-slate-700 dark:text-slate-300 text-xs">IV</th>
                                            <th className="text-left py-3 px-4 font-bold text-slate-700 dark:text-slate-300 text-xs">Expiry</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {relevantOptions.slice(0, 10).map((option, idx) => (
                                            <tr 
                                              key={idx} 
                                              className="border-t border-slate-200 dark:border-slate-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-transparent dark:hover:from-teal-900/20 dark:hover:to-transparent transition-all cursor-pointer"
                                            >
                                              <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{formatCurrency(option.strikePrice)}</td>
                                              <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300 font-medium">{formatCurrency(option.bid)}</td>
                                              <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300 font-medium">{formatCurrency(option.ask)}</td>
                                              <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">{formatCurrency(option.lastPrice)}</td>
                                              <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">{option.volume.toLocaleString()}</td>
                                              <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">{option.openInterest.toLocaleString()}</td>
                                              <td className="py-3 px-4 text-right">
                                                <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold">
                                                  {(option.impliedVolatility * 100).toFixed(1)}%
                                                </span>
                                              </td>
                                              <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                                                {new Date(option.expirationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                    {relevantOptions.length > 10 && (
                                      <div className="p-4 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-center">
                                        <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                                          📊 Showing 10 of {relevantOptions.length} options
                                        </p>
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
