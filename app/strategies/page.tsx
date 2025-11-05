'use client'

import { useState } from 'react'
import Dashboard from '@/components/Dashboard'
import { BookOpen, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react'

const strategies = [
  {
    category: 'Basic Strategies',
    icon: BookOpen,
    strategies: [
      {
        name: 'Long Call',
        direction: 'Bullish',
        risk: 'Limited',
        reward: 'Unlimited',
        description: 'Buy a call option. Profit if stock price rises above strike + premium.',
        bestFor: 'Strong bullish conviction',
      },
      {
        name: 'Long Put',
        direction: 'Bearish',
        risk: 'Limited',
        reward: 'High',
        description: 'Buy a put option. Profit if stock price falls below strike - premium.',
        bestFor: 'Bearish outlook or portfolio protection',
      },
      {
        name: 'Covered Call',
        direction: 'Neutral to Bullish',
        risk: 'Unlimited',
        reward: 'Limited',
        description: 'Own stock and sell call option. Generate income while limiting upside.',
        bestFor: 'Generating income on owned stocks',
      },
      {
        name: 'Protective Put',
        direction: 'Any (Insurance)',
        risk: 'Limited',
        reward: 'Unlimited',
        description: 'Own stock and buy put option as insurance against downside.',
        bestFor: 'Protecting long stock positions',
      },
    ],
  },
  {
    category: 'Bullish Strategies',
    icon: TrendingUp,
    strategies: [
      {
        name: 'Bull Call Spread',
        direction: 'Bullish',
        risk: 'Limited',
        reward: 'Limited',
        description: 'Buy lower strike call, sell higher strike call. Lower cost than long call.',
        bestFor: 'Moderate bullish moves with defined risk',
      },
      {
        name: 'Bull Put Spread',
        direction: 'Bullish',
        risk: 'Limited',
        reward: 'Limited',
        description: 'Sell higher strike put, buy lower strike put. Collect premium.',
        bestFor: 'Bullish with limited move expected',
      },
      {
        name: 'Call Debit Spread',
        direction: 'Bullish',
        risk: 'Limited',
        reward: 'Limited',
        description: 'Similar to Bull Call Spread. Uses debit (buying lower, selling higher).',
        bestFor: 'Bullish outlook with cost efficiency',
      },
    ],
  },
  {
    category: 'Bearish Strategies',
    icon: TrendingDown,
    strategies: [
      {
        name: 'Bear Put Spread',
        direction: 'Bearish',
        risk: 'Limited',
        reward: 'Limited',
        description: 'Buy higher strike put, sell lower strike put. Same expiration.',
        bestFor: 'Moderate bearish moves',
      },
      {
        name: 'Bear Call Spread',
        direction: 'Bearish',
        risk: 'Limited',
        reward: 'Limited',
        description: 'Sell lower strike call, buy higher strike call. Collect premium.',
        bestFor: 'Bearish with limited move expected',
      },
    ],
  },
  {
    category: 'Neutral Strategies',
    icon: Minus,
    strategies: [
      {
        name: 'Iron Condor',
        direction: 'Neutral',
        risk: 'Limited',
        reward: 'Limited',
        description: 'Sell put spread and call spread. Profit if stock stays in range.',
        bestFor: 'Low volatility, range-bound markets',
      },
      {
        name: 'Iron Butterfly',
        direction: 'Neutral',
        risk: 'Limited',
        reward: 'Limited',
        description: 'Sell at-the-money call and put, buy out-of-the-money options.',
        bestFor: 'Very low volatility, stock at strike',
      },
      {
        name: 'Calendar Spread',
        direction: 'Neutral to Slightly Directional',
        risk: 'Limited',
        reward: 'Limited',
        description: 'Sell short-term option, buy longer-term option. Same strike.',
        bestFor: 'Time decay plays, volatility changes',
      },
    ],
  },
  {
    category: 'Volatility Strategies',
    icon: Zap,
    strategies: [
      {
        name: 'Long Straddle',
        direction: 'Volatile (Non-Directional)',
        risk: 'Limited',
        reward: 'Unlimited Both Ways',
        description: 'Buy call and put at same strike. Profit if stock moves significantly either way.',
        bestFor: 'High volatility expected, uncertain direction',
      },
      {
        name: 'Long Strangle',
        direction: 'Volatile (Non-Directional)',
        risk: 'Limited',
        reward: 'Unlimited',
        description: 'Buy out-of-the-money call and put. Cheaper than straddle.',
        bestFor: 'High volatility, cheaper than straddle',
      },
      {
        name: 'Short Strangle',
        direction: 'Low Volatility',
        risk: 'Unlimited Both Ways',
        reward: 'Limited',
        description: 'Sell out-of-the-money call and put. Profit if stock stays in range.',
        bestFor: 'Range-bound, collecting premium',
      },
    ],
  },
]

export default function StrategiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCategories = strategies.filter((category) => {
    if (selectedCategory && category.category !== selectedCategory) return false
    if (searchTerm) {
      return category.strategies.some(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return true
  })

  const getDirectionColor = (direction: string) => {
    if (direction.includes('Bullish')) return 'text-green-600 dark:text-green-400'
    if (direction.includes('Bearish')) return 'text-red-600 dark:text-red-400'
    if (direction.includes('Neutral')) return 'text-blue-600 dark:text-blue-400'
    if (direction.includes('Volatile')) return 'text-purple-600 dark:text-purple-400'
    return 'text-slate-600 dark:text-slate-400'
  }

  return (
    <main className="h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-auto">
      <Dashboard>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Options Trading Strategies
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              Comprehensive guide to options trading strategies with risk profiles, use cases, and examples.
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Search strategies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {strategies.map((cat) => (
                  <option key={cat.category} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Strategies Grid */}
          <div className="space-y-8">
            {filteredCategories.map((category) => {
              const Icon = category.icon
              const filteredStrategies = category.strategies.filter((s) =>
                searchTerm
                  ? s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.description.toLowerCase().includes(searchTerm.toLowerCase())
                  : true
              )

              if (filteredStrategies.length === 0) return null

              return (
                <div key={category.category} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                      <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {category.category}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStrategies.map((strategy) => (
                      <div
                        key={strategy.name}
                        className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {strategy.name}
                          </h3>
                        </div>

                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Direction:
                            </span>
                            <span className={`text-xs font-semibold ${getDirectionColor(strategy.direction)}`}>
                              {strategy.direction}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Risk:
                            </span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {strategy.risk}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Reward:
                            </span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {strategy.reward}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {strategy.description}
                        </p>

                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Best for:
                          </span>
                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                            {strategy.bestFor}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
              ⚠️ Important Disclaimer
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Options trading involves significant risk and is not suitable for all investors. You can lose
              your entire investment. Options can expire worthless, and early assignment can occur. This
              guide is for educational purposes only and does not constitute financial advice. Always do
              your own research and consider consulting a financial advisor.
            </p>
          </div>

          {/* Resources */}
          <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Additional Resources
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                📚 <a href="https://www.cboe.com/learncenter/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                  CBOE Options Education
                </a>
              </li>
              <li>
                📖 <a href="https://www.investopedia.com/options/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                  Investopedia Options Trading Strategies
                </a>
              </li>
              <li>
                📊 <a href="https://www.investopedia.com/trading/options-greeks/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                  Options Greeks Explained
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Dashboard>
    </main>
  )
}

