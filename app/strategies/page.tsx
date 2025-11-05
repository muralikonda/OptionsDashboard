'use client'

import { useState } from 'react'
import Dashboard from '@/components/Dashboard'
import StrategyCard from '@/components/StrategyCard'
import { BookOpen, TrendingUp, TrendingDown, Minus, Zap, Search } from 'lucide-react'

// Strategy definitions with profit calculation functions
const strategiesData = [
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
        scenarios: {
          stockRises: 'If stock rises above strike + premium ($190 in this example), you profit. The higher the stock goes, the more you profit. Your profit is unlimited.',
          stockFalls: 'If stock falls below the strike price, you lose the entire premium paid ($5). The option expires worthless.',
          stockStaysSame: 'If stock stays at or below the strike price, you lose the premium paid. Time decay works against you.',
        },
        example: {
          stock: 'AAPL',
          stockPrice: 180,
          strike: 185,
          premium: 5,
        },
        calculateProfit: (stockPrice: number, params: any) => {
          const { strike, premium } = params
          if (stockPrice <= strike) return -premium
          return stockPrice - strike - premium
        },
      },
      {
        name: 'Long Put',
        direction: 'Bearish',
        risk: 'Limited',
        reward: 'High',
        description: 'Buy a put option. Profit if stock price falls below strike - premium.',
        bestFor: 'Bearish outlook or portfolio protection',
        scenarios: {
          stockRises: 'If stock rises above the strike price, you lose the entire premium paid ($8). The option expires worthless.',
          stockFalls: 'If stock falls below strike - premium ($237 in this example), you profit. The lower the stock goes, the more you profit. Maximum profit if stock goes to $0.',
          stockStaysSame: 'If stock stays at or above the strike price, you lose the premium paid. Time decay erodes the option value.',
        },
        example: {
          stock: 'TSLA',
          stockPrice: 250,
          strike: 245,
          premium: 8,
        },
        calculateProfit: (stockPrice: number, params: any) => {
          const { strike, premium } = params
          if (stockPrice >= strike) return -premium
          return strike - stockPrice - premium
        },
      },
      {
        name: 'Covered Call',
        direction: 'Neutral to Bullish',
        risk: 'Unlimited',
        reward: 'Limited',
        description: 'Own stock and sell call option. Generate income while limiting upside.',
        bestFor: 'Generating income on owned stocks',
        scenarios: {
          stockRises: 'If stock rises above strike ($390), you keep the premium ($6) and stock profit up to strike, but you miss gains above strike. Stock gets called away at $390.',
          stockFalls: 'If stock falls, you keep the premium ($6) which partially offsets your stock loss. However, you still lose money if stock falls significantly below your purchase price.',
          stockStaysSame: 'If stock stays near current price, you keep the premium ($6) as income. This is the ideal scenario - you earn premium without losing stock.',
        },
        example: {
          stock: 'MSFT',
          stockPrice: 380,
          strike: 390,
          premium: 6,
          stockOwned: true,
        },
        calculateProfit: (stockPrice: number, params: any) => {
          const { strike, premium, stockPrice: entryPrice } = params
          const stockProfit = stockPrice - entryPrice
          let optionProfit = premium
          if (stockPrice > strike) {
            optionProfit = premium - (stockPrice - strike)
          }
          return stockProfit + optionProfit
        },
      },
      {
        name: 'Protective Put',
        direction: 'Any (Insurance)',
        risk: 'Limited',
        reward: 'Unlimited',
        description: 'Own stock and buy put option as insurance against downside.',
        bestFor: 'Protecting long stock positions',
        scenarios: {
          stockRises: 'If stock rises, you participate in all upside gains. You only lose the premium paid ($4) for insurance. Net profit = stock gain - $4.',
          stockFalls: 'If stock falls below strike ($140), your put protects you. Loss is limited to (entry price - strike + premium) = $9 max loss regardless of how far stock falls.',
          stockStaysSame: 'If stock stays flat, you lose the premium paid ($4) for the insurance. This is the cost of protection.',
        },
        example: {
          stock: 'GOOGL',
          stockPrice: 145,
          strike: 140,
          premium: 4,
          stockOwned: true,
        },
        calculateProfit: (stockPrice: number, params: any) => {
          const { strike, premium, stockPrice: entryPrice } = params
          const stockProfit = stockPrice - entryPrice
          let putProfit = -premium
          if (stockPrice < strike) {
            putProfit = strike - stockPrice - premium
          }
          return stockProfit + putProfit
        },
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
        scenarios: {
          stockRises: 'If stock rises above higher strike ($195), you reach max profit. Profit = (strike2 - strike) - net cost = $10 - $3 = $7. Profit capped at higher strike.',
          stockFalls: 'If stock falls below lower strike ($185), you lose the net premium paid ($3). Both calls expire worthless.',
          stockStaysSame: 'If stock stays between strikes, you lose net premium. Need stock above lower strike to profit.',
        },
        example: {
          stock: 'AAPL',
          stockPrice: 180,
          strike: 185,
          premium: 5,
          strike2: 195,
          premium2: 2,
        },
        calculateProfit: (stockPrice: number, params: any) => {
          const { strike, premium, strike2, premium2 } = params
          const netCost = premium - premium2
          if (stockPrice <= strike) return -netCost
          if (stockPrice >= strike2) return strike2 - strike - netCost
          return stockPrice - strike - netCost
        },
      },
      {
        name: 'Bull Put Spread',
        direction: 'Bullish',
        risk: 'Limited',
        reward: 'Limited',
        description: 'Sell higher strike put, buy lower strike put. Collect premium.',
        bestFor: 'Bullish with limited move expected',
        scenarios: {
          stockRises: 'If stock rises above higher strike ($490), you keep the full net credit ($2). This is max profit.',
          stockFalls: 'If stock falls below lower strike ($480), you hit max loss. Loss = (strike - strike2) - net credit = $10 - $2 = $8.',
          stockStaysSame: 'If stock stays above higher strike, you keep the premium. Ideal scenario - stock stays flat or rises slightly.',
        },
        example: {
          stock: 'NVDA',
          stockPrice: 500,
          strike: 490,
          premium: 3,
          strike2: 480,
          premium2: 1,
        },
        calculateProfit: (stockPrice: number, params: any) => {
          const { strike, premium, strike2, premium2 } = params
          const netCredit = premium - premium2
          if (stockPrice >= strike) return netCredit
          if (stockPrice <= strike2) return strike2 - strike + netCredit
          return strike - stockPrice + netCredit
        },
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
        scenarios: {
          stockRises: 'If stock rises above higher strike ($485), you lose the net premium paid ($4). Both puts expire worthless.',
          stockFalls: 'If stock falls below lower strike ($475), you reach max profit. Profit = (strike - strike2) - net cost = $10 - $4 = $6.',
          stockStaysSame: 'If stock stays between strikes, you lose net premium. Need stock below higher strike to profit.',
        },
        example: {
          stock: 'META',
          stockPrice: 490,
          strike: 485,
          premium: 8,
          strike2: 475,
          premium2: 4,
        },
        calculateProfit: (stockPrice: number, params: any) => {
          const { strike, premium, strike2, premium2 } = params
          const netCost = premium - premium2
          if (stockPrice >= strike) return -netCost
          if (stockPrice <= strike2) return strike - strike2 - netCost
          return strike - stockPrice - netCost
        },
      },
      {
        name: 'Bear Call Spread',
        direction: 'Bearish',
        risk: 'Limited',
        reward: 'Limited',
        description: 'Sell lower strike call, buy higher strike call. Collect premium.',
        bestFor: 'Bearish with limited move expected',
        scenarios: {
          stockRises: 'If stock rises above higher strike ($165), you hit max loss. Loss = (strike2 - strike) - net credit = $10 - $3 = $7.',
          stockFalls: 'If stock falls below lower strike ($155), you keep the full net credit ($3). This is max profit.',
          stockStaysSame: 'If stock stays below lower strike, you keep the premium. Ideal scenario - stock stays flat or falls slightly.',
        },
        example: {
          stock: 'AMZN',
          stockPrice: 150,
          strike: 155,
          premium: 5,
          strike2: 165,
          premium2: 2,
        },
        calculateProfit: (stockPrice: number, params: any) => {
          const { strike, premium, strike2, premium2 } = params
          const netCredit = premium - premium2
          if (stockPrice <= strike) return netCredit
          if (stockPrice >= strike2) return strike - strike2 + netCredit
          return strike - stockPrice + netCredit
        },
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
        scenarios: {
          stockRises: 'If stock rises above upper range, you start losing money. Max loss if stock goes significantly above upper strike.',
          stockFalls: 'If stock falls below lower range, you start losing money. Max loss if stock goes significantly below lower strike.',
          stockStaysSame: 'If stock stays within the range (between $445-$455), you keep the net premium collected. This is the ideal scenario.',
        },
        example: {
          stock: 'SPY',
          stockPrice: 450,
          strike: 445,
          premium: 2,
          strike2: 455,
          premium2: 2,
        },
        calculateProfit: (stockPrice: number, params: any) => {
          const { strike, premium, strike2 } = params
          const netCredit = premium * 2 // Simplified
          if (stockPrice >= strike && stockPrice <= strike2) return netCredit
          if (stockPrice < strike - 5) return netCredit - (strike - 5 - stockPrice)
          if (stockPrice > strike2 + 5) return netCredit - (stockPrice - strike2 - 5)
          return netCredit
        },
      },
      {
        name: 'Iron Butterfly',
        direction: 'Neutral',
        risk: 'Limited',
        reward: 'Limited',
        description: 'Sell at-the-money call and put, buy out-of-the-money options.',
        bestFor: 'Very low volatility, stock at strike',
        scenarios: {
          stockRises: 'If stock rises significantly above strike ($380), you lose money. Max loss if stock moves far beyond protective strikes.',
          stockFalls: 'If stock falls significantly below strike, you lose money. Max loss if stock moves far beyond protective strikes.',
          stockStaysSame: 'If stock stays exactly at strike ($380), you keep maximum premium collected. This is the ideal scenario - stock stays perfectly at strike.',
        },
        example: {
          stock: 'QQQ',
          stockPrice: 380,
          strike: 380,
          premium: 3,
          strike2: 390,
          premium2: 1,
        },
        calculateProfit: (stockPrice: number, params: any) => {
          const { strike, premium, strike2, premium2 } = params
          const netCredit = premium * 2 - premium2 * 2
          if (stockPrice === strike) return netCredit
          if (stockPrice < strike - 10) return netCredit - (strike - 10 - stockPrice)
          if (stockPrice > strike + 10) return netCredit - (stockPrice - strike - 10)
          return netCredit - Math.abs(stockPrice - strike)
        },
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
        scenarios: {
          stockRises: 'If stock rises significantly above strike + premium ($260), you profit. The higher it goes, the more you profit. Unlimited upside.',
          stockFalls: 'If stock falls significantly below strike - premium ($240), you profit. The lower it goes, the more you profit. Can profit down to $0.',
          stockStaysSame: 'If stock stays near strike ($250), you lose both premiums ($10). This is the worst scenario - need big move to profit.',
        },
        example: {
          stock: 'TSLA',
          stockPrice: 250,
          strike: 250,
          premium: 10,
        },
        calculateProfit: (stockPrice: number, params: any) => {
          const { strike, premium } = params
          const callProfit = stockPrice > strike ? stockPrice - strike - premium : -premium
          const putProfit = stockPrice < strike ? strike - stockPrice - premium : -premium
          return callProfit + putProfit
        },
      },
      {
        name: 'Long Strangle',
        direction: 'Volatile (Non-Directional)',
        risk: 'Limited',
        reward: 'Unlimited',
        description: 'Buy out-of-the-money call and put. Cheaper than straddle.',
        bestFor: 'High volatility, cheaper than straddle',
        scenarios: {
          stockRises: 'If stock rises significantly above call strike ($520), you profit. The higher it goes, the more you profit. Unlimited upside.',
          stockFalls: 'If stock falls significantly below put strike ($480), you profit. The lower it goes, the more you profit. Can profit down to $0.',
          stockStaysSame: 'If stock stays between the strikes ($480-$520), you lose both premiums ($8). Need bigger move than straddle to profit, but cheaper to enter.',
        },
        example: {
          stock: 'NVDA',
          stockPrice: 500,
          strike: 520,
          premium: 4,
          strike2: 480,
          premium2: 4,
        },
        calculateProfit: (stockPrice: number, params: any) => {
          const { strike, premium, strike2, premium2 } = params
          const callProfit = stockPrice > strike ? stockPrice - strike - premium : -premium
          const putProfit = stockPrice < strike2 ? strike2 - stockPrice - premium2 : -premium2
          return callProfit + putProfit
        },
      },
    ],
  },
]

export default function StrategiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCategories = strategiesData.filter((category) => {
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

  return (
    <main className="h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Dashboard>
        <div className="h-full overflow-y-auto w-full">
          <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Options Trading Strategies
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              Interactive guide with profit/loss graphs, calculators, and examples for each strategy.
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search strategies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {strategiesData.map((cat) => (
                  <option key={cat.category} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Strategies List */}
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

                  <div className="space-y-4">
                    {filteredStrategies.map((strategy) => (
                      <StrategyCard key={strategy.name} strategy={strategy} />
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
        </div>
      </Dashboard>
    </main>
  )
}
