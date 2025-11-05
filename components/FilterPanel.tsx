import { FilterCriteria } from '@/types'
import { Filter, X, Search, BarChart3, TrendingUp } from 'lucide-react'

interface FilterPanelProps {
  filters: FilterCriteria
  onFiltersChange: (filters: FilterCriteria) => void
  selectedTab: 'stocks' | 'options'
}

const sectors = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Consumer Cyclical',
  'Communication Services',
  'Industrials',
  'Consumer Defensive',
  'Energy',
  'Utilities',
  'Real Estate',
  'Basic Materials',
]

export default function FilterPanel({ filters, onFiltersChange, selectedTab }: FilterPanelProps) {
  const updateFilter = (key: keyof FilterCriteria, value: string | undefined) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      searchText: '',
      minPrice: '',
      maxPrice: '',
      minVolume: '',
      minMarketCap: '',
      sector: '',
      minCallVolume: '',
      maxStrikePrice: '',
      minOpenInterest: '',
      expirationDate: '',
      minIV: '',
      maxIV: '',
      minDelta: '',
      maxDelta: '',
      chartPattern: '',
      priceTrend: undefined,
      volatility: undefined,
    })
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-xl shadow-xl border-2 border-slate-200 dark:border-slate-700 p-3 sm:p-4 lg:p-6 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4 sm:mb-5 lg:mb-6 flex-shrink-0 pb-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-lg shadow-md">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Filters</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Refine your search
            </p>
          </div>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm hover:shadow-md"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear All</span>
            <span className="sm:hidden">Clear</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4">
        {selectedTab === 'stocks' ? (
          <>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                Search Symbol or Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g., AAPL or Apple"
                  value={filters.searchText}
                  onChange={(e) => updateFilter('searchText', e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                💰 Price Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Min $"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm hover:shadow-md"
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Max $"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm hover:shadow-md"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Min Volume
              </label>
              <input
                type="number"
                placeholder="e.g., 1000000"
                value={filters.minVolume}
                onChange={(e) => updateFilter('minVolume', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Min Market Cap ($B)
              </label>
              <input
                type="number"
                placeholder="e.g., 10"
                value={filters.minMarketCap}
                onChange={(e) => updateFilter('minMarketCap', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Sector
              </label>
              <select
                value={filters.sector}
                onChange={(e) => updateFilter('sector', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Sectors</option>
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Min Volume
              </label>
              <input
                type="number"
                placeholder="e.g., 100"
                value={filters.minCallVolume}
                onChange={(e) => updateFilter('minCallVolume', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Max Strike Price
              </label>
              <input
                type="number"
                placeholder="e.g., 500"
                value={filters.maxStrikePrice}
                onChange={(e) => updateFilter('maxStrikePrice', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Min Open Interest
              </label>
              <input
                type="number"
                placeholder="e.g., 1000"
                value={filters.minOpenInterest}
                onChange={(e) => updateFilter('minOpenInterest', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Expiration Date
              </label>
              <input
                type="date"
                value={filters.expirationDate}
                onChange={(e) => updateFilter('expirationDate', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Implied Volatility (IV) Range (%)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min %"
                  value={filters.minIV}
                  onChange={(e) => updateFilter('minIV', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max %"
                  value={filters.maxIV}
                  onChange={(e) => updateFilter('maxIV', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {['15', '25', '35', '50'].map((preset) => (
                  <button
                    key={`iv-min-${preset}`}
                    onClick={() => updateFilter('minIV', preset)}
                    className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    Min {preset}%
                  </button>
                ))}
                {['30', '40', '50', '65'].map((preset) => (
                  <button
                    key={`iv-max-${preset}`}
                    onClick={() => updateFilter('maxIV', preset)}
                    className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    Max {preset}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Delta Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Min"
                  value={filters.minDelta}
                  onChange={(e) => updateFilter('minDelta', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Max"
                  value={filters.maxDelta}
                  onChange={(e) => updateFilter('maxDelta', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {['0.3', '0.5', '0.7'].map((preset) => (
                  <button
                    key={`delta-min-${preset}`}
                    onClick={() => updateFilter('minDelta', preset)}
                    className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    Min {preset}
                  </button>
                ))}
                {['-0.3', '-0.5', '-0.7'].map((preset) => (
                  <button
                    key={`delta-min-neg-${preset}`}
                    onClick={() => updateFilter('minDelta', preset)}
                    className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    Min {preset}
                  </button>
                ))}
                {['0.5', '0.7', '0.9'].map((preset) => (
                  <button
                    key={`delta-max-${preset}`}
                    onClick={() => updateFilter('maxDelta', preset)}
                    className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    Max {preset}
                  </button>
                ))}
                {['-0.1', '-0.3', '-0.5'].map((preset) => (
                  <button
                    key={`delta-max-neg-${preset}`}
                    onClick={() => updateFilter('maxDelta', preset)}
                    className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    Max {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Pattern Filters */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-3 border border-purple-200 dark:border-purple-800/30">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Chart Pattern
              </label>
              <select
                value={filters.chartPattern || ''}
                onChange={(e) => updateFilter('chartPattern', e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-purple-300 dark:border-purple-700 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-medium shadow-sm hover:shadow-md transition-all"
              >
                <option value="">📊 All Patterns</option>
                <option value="Head and Shoulders">👤 Head and Shoulders</option>
                <option value="Double Top">⛰️ Double Top</option>
                <option value="Double Bottom">🏔️ Double Bottom</option>
                <option value="Ascending Triangle">📈 Ascending Triangle</option>
                <option value="Descending Triangle">📉 Descending Triangle</option>
                <option value="Symmetrical Triangle">⚖️ Symmetrical Triangle</option>
                <option value="Bullish Flag">🚩 Bullish Flag</option>
                <option value="Bearish Flag">🚩 Bearish Flag</option>
                <option value="Cup and Handle">☕ Cup and Handle</option>
                <option value="Rising Wedge">⬆️ Rising Wedge</option>
                <option value="Falling Wedge">⬇️ Falling Wedge</option>
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Filter by detected chart patterns
              </p>
            </div>

            {/* Price Trend Filter */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800/30">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Price Trend
              </label>
              <select
                value={filters.priceTrend || ''}
                onChange={(e) => updateFilter('priceTrend', e.target.value || undefined)}
                className="w-full px-3 py-2.5 border-2 border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium shadow-sm hover:shadow-md transition-all"
              >
                <option value="">📊 All Trends</option>
                <option value="uptrend">📈 Uptrend</option>
                <option value="downtrend">📉 Downtrend</option>
                <option value="sideways">➡️ Sideways</option>
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Filter by overall price direction
              </p>
            </div>

            {/* Volatility Filter */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-3 border border-orange-200 dark:border-orange-800/30">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                Volatility
              </label>
              <select
                value={filters.volatility || ''}
                onChange={(e) => updateFilter('volatility', e.target.value || undefined)}
                className="w-full px-3 py-2.5 border-2 border-orange-300 dark:border-orange-700 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium shadow-sm hover:shadow-md transition-all"
              >
                <option value="">📊 All Volatility</option>
                <option value="low">🔵 Low Volatility</option>
                <option value="medium">🟡 Medium Volatility</option>
                <option value="high">🔴 High Volatility</option>
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Filter by price movement volatility
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

