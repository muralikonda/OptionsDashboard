'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Calculator, TrendingUp, DollarSign, TrendingDown, Minus, AlertCircle } from 'lucide-react'
import { LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'

export interface StrategyData {
  name: string
  direction: string
  risk: string
  reward: string
  description: string
  bestFor: string
  scenarios?: {
    stockRises: string
    stockFalls: string
    stockStaysSame: string
  }
  example: {
    stock: string
    stockPrice: number
    strike: number
    premium: number
    strike2?: number
    premium2?: number
    stockOwned?: boolean
  }
  calculateProfit: (stockPrice: number, params: any) => number
}

interface StrategyCardProps {
  strategy: StrategyData
}

export default function StrategyCard({ strategy }: StrategyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [customStockPrice, setCustomStockPrice] = useState(strategy.example.stockPrice)
  const [customPremium, setCustomPremium] = useState(strategy.example.premium)
  
  // Unique gradient IDs to avoid conflicts when multiple charts are rendered
  const gradientId = `gradient-${strategy.name.replace(/\s+/g, '-').toLowerCase()}`
  const profitGradientId = `profit-${gradientId}`
  const lossGradientId = `loss-${gradientId}`

  // Generate profit/loss data for chart
  const generateChartData = () => {
    const data = []
    const minPrice = Math.max(0, strategy.example.stockPrice * 0.7)
    const maxPrice = strategy.example.stockPrice * 1.3
    const step = (maxPrice - minPrice) / 50

    for (let price = minPrice; price <= maxPrice; price += step) {
      const profit = strategy.calculateProfit(price, {
        ...strategy.example,
        premium: customPremium,
      })
      data.push({
        price: Math.round(price * 100) / 100,
        profit: Math.round(profit * 100) / 100,
      })
    }
    return data
  }

  const chartData = generateChartData()
  const currentProfit = strategy.calculateProfit(customStockPrice, {
    ...strategy.example,
    premium: customPremium,
  })

  const getDirectionColor = (direction: string) => {
    if (direction.includes('Bullish')) return 'text-green-600 dark:text-green-400'
    if (direction.includes('Bearish')) return 'text-red-600 dark:text-red-400'
    if (direction.includes('Neutral')) return 'text-blue-600 dark:text-blue-400'
    if (direction.includes('Volatile')) return 'text-purple-600 dark:text-purple-400'
    return 'text-slate-600 dark:text-slate-400'
  }

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div
        className="p-4 cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {strategy.name}
              </h3>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${getDirectionColor(strategy.direction)} bg-opacity-10`}>
                {strategy.direction}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{strategy.description}</p>
          </div>
          <button className="ml-4 p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Info and Example */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Strategy Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Risk:</span>
                    <span className="ml-2 font-semibold text-slate-900 dark:text-white">{strategy.risk}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Reward:</span>
                    <span className="ml-2 font-semibold text-slate-900 dark:text-white">{strategy.reward}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  <strong>Best for:</strong> {strategy.bestFor}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Example Setup
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Stock:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{strategy.example.stock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Current Stock Price:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">${strategy.example.stockPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Strike Price:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">${strategy.example.strike}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Premium Paid:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">${strategy.example.premium}</span>
                  </div>
                  {strategy.example.strike2 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Second Strike:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">${strategy.example.strike2}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Second Premium:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">${strategy.example.premium2}</span>
                      </div>
                    </>
                  )}
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Break-even:</span>
                      <span className="font-bold text-primary-600 dark:text-primary-400">
                        ${calculateBreakEven(strategy)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-slate-600 dark:text-slate-400">Max Profit:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {getMaxProfit(strategy)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-slate-600 dark:text-slate-400">Max Loss:</span>
                      <span className="font-bold text-red-600 dark:text-red-400">
                        {getMaxLoss(strategy)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scenario Explanations */}
              {strategy.scenarios && (
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    What Happens in Different Scenarios
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <h5 className="font-semibold text-green-800 dark:text-green-300 text-sm">If Stock Rises</h5>
                      </div>
                      <p className="text-xs text-green-700 dark:text-green-400 ml-6">{strategy.scenarios.stockRises}</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
                      <div className="flex items-start gap-2 mb-2">
                        <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <h5 className="font-semibold text-red-800 dark:text-red-300 text-sm">If Stock Falls</h5>
                      </div>
                      <p className="text-xs text-red-700 dark:text-red-400 ml-6">{strategy.scenarios.stockFalls}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-2 mb-2">
                        <Minus className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <h5 className="font-semibold text-blue-800 dark:text-blue-300 text-sm">If Stock Stays Same</h5>
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-400 ml-6">{strategy.scenarios.stockStaysSame}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Calculator */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Interactive Calculator
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Stock Price at Expiration
                    </label>
                    <input
                      type="number"
                      value={customStockPrice}
                      onChange={(e) => setCustomStockPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      step="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Premium Paid
                    </label>
                    <input
                      type="number"
                      value={customPremium}
                      onChange={(e) => setCustomPremium(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      step="0.1"
                    />
                  </div>
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Profit/Loss at ${customStockPrice}:
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          currentProfit >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {currentProfit >= 0 ? '+' : ''}${currentProfit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Chart */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Profit/Loss Chart
              </h4>
              <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={profitGradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="50%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id={lossGradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                        <stop offset="50%" stopColor="#ef4444" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="currentColor" 
                      className="opacity-20 dark:opacity-10"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="price"
                      stroke="currentColor"
                      className="text-slate-600 dark:text-slate-400"
                      style={{ fontSize: '12px' }}
                      tick={{ fill: 'currentColor' }}
                      label={{ 
                        value: 'Stock Price ($)', 
                        position: 'insideBottom', 
                        offset: -5,
                        style: { textAnchor: 'middle', fill: 'currentColor' },
                        className: 'text-slate-600 dark:text-slate-400'
                      }}
                    />
                    <YAxis
                      stroke="currentColor"
                      className="text-slate-600 dark:text-slate-400"
                      style={{ fontSize: '12px' }}
                      tick={{ fill: 'currentColor' }}
                      label={{ 
                        value: 'Profit/Loss ($)', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle', fill: 'currentColor' },
                        className: 'text-slate-600 dark:text-slate-400'
                      }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          const profit = data.profit
                          const isProfit = profit >= 0
                          return (
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-3">
                              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                Stock Price: <span className="text-primary-600 dark:text-primary-400">${data.price.toFixed(2)}</span>
                              </p>
                              <p className={`text-lg font-bold ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {isProfit ? '+' : ''}${profit.toFixed(2)}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {isProfit ? 'Profit' : 'Loss'}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                      cursor={{ stroke: currentProfit >= 0 ? '#10b981' : '#ef4444', strokeWidth: 2, strokeDasharray: '5 5' }}
                    />
                    <ReferenceLine 
                      y={0} 
                      stroke="#94a3b8" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      className="opacity-60"
                      label={{ value: 'Break-even', position: 'right', fill: '#94a3b8', className: 'text-xs' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke={currentProfit >= 0 ? '#10b981' : '#ef4444'}
                      strokeWidth={3}
                      fill={currentProfit >= 0 ? `url(#${profitGradientId})` : `url(#${lossGradientId})`}
                      fillOpacity={0.6}
                      dot={false}
                      activeDot={{ 
                        r: 6, 
                        fill: currentProfit >= 0 ? '#10b981' : '#ef4444',
                        stroke: 'white',
                        strokeWidth: 2,
                        className: 'drop-shadow-lg'
                      }}
                      name="Profit/Loss"
                      animationDuration={300}
                    />
                    {/* Current price indicator */}
                    <ReferenceLine 
                      x={customStockPrice} 
                      stroke={currentProfit >= 0 ? '#10b981' : '#ef4444'} 
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      className="opacity-50"
                      label={{ 
                        value: `Current: $${customStockPrice.toFixed(2)}`, 
                        position: 'top',
                        fill: currentProfit >= 0 ? '#10b981' : '#ef4444',
                        className: 'text-xs font-semibold'
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-6 flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${currentProfit >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-slate-600 dark:text-slate-400">
                      Profit/Loss Line
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-slate-400 border-dashed border border-slate-400"></div>
                    <span className="text-slate-600 dark:text-slate-400">
                      Break-even ($0)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-0.5 border-dashed border-2 ${currentProfit >= 0 ? 'border-green-500' : 'border-red-500'}`}></div>
                    <span className="text-slate-600 dark:text-slate-400">
                      Current Price
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper functions for calculations
function calculateBreakEven(strategy: StrategyData): string {
  const { strike, premium, strike2, premium2 } = strategy.example
  // This is a simplified calculation - actual break-even varies by strategy
  if (strategy.name === 'Long Call') {
    return (strike + premium).toFixed(2)
  }
  if (strategy.name === 'Long Put') {
    return (strike - premium).toFixed(2)
  }
  if (strategy.name === 'Bull Call Spread' && strike2) {
    const netCost = premium - (premium2 || 0)
    return (strike + netCost).toFixed(2)
  }
  if (strategy.name === 'Covered Call') {
    const { stockPrice } = strategy.example
    return stockPrice.toFixed(2) // Break-even is where you bought the stock
  }
  if (strategy.name === 'Protective Put') {
    const { stockPrice } = strategy.example
    return stockPrice.toFixed(2)
  }
  return 'N/A'
}

function getMaxProfit(strategy: StrategyData): string {
  const { strike, premium, strike2, premium2 } = strategy.example
  if (strategy.name === 'Long Call') {
    return 'Unlimited'
  }
  if (strategy.name === 'Long Put') {
    return `$${(strike - premium).toFixed(2)}`
  }
  if (strategy.name === 'Bull Call Spread' && strike2) {
    const spread = strike2 - strike
    const netCost = premium - (premium2 || 0)
    return `$${(spread - netCost).toFixed(2)}`
  }
  if (strategy.name === 'Covered Call') {
    const { stockPrice, strike: callStrike, premium } = strategy.example
    const maxProfit = (callStrike - stockPrice) + premium
    return `$${maxProfit.toFixed(2)}`
  }
  if (strategy.name === 'Protective Put') {
    return 'Unlimited'
  }
  return 'Varies'
}

function getMaxLoss(strategy: StrategyData): string {
  const { premium, premium2, stockPrice, strike } = strategy.example
  if (strategy.name === 'Long Call' || strategy.name === 'Long Put') {
    return `$${premium.toFixed(2)}`
  }
  if (strategy.name === 'Bull Call Spread' || strategy.name === 'Bear Put Spread') {
    const netCost = premium - (premium2 || 0)
    return `$${netCost.toFixed(2)}`
  }
  if (strategy.name === 'Covered Call') {
    return 'Unlimited (stock can fall to $0)'
  }
  if (strategy.name === 'Protective Put') {
    return `$${(stockPrice - strike + premium).toFixed(2)}`
  }
  return 'Varies'
}

