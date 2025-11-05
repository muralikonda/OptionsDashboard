import { FilterCriteria } from '@/types'
import { Filter, X, Search } from 'lucide-react'

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
  const updateFilter = (key: keyof FilterCriteria, value: string) => {
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
    })
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4">
        {selectedTab === 'stocks' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Search Symbol or Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g., AAPL or Apple"
                  value={filters.searchText}
                  onChange={(e) => updateFilter('searchText', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
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
          </>
        )}
      </div>
    </div>
  )
}

