'use client'

import { useState, useEffect, useCallback } from 'react'
import Dashboard from '@/components/Dashboard'
import FilterPanel from '@/components/FilterPanel'
import StockTable from '@/components/StockTable'
import OptionsTable from '@/components/OptionsTable'
import { Stock, Option, FilterCriteria } from '@/types'
import { Filter, X, AlertCircle, RefreshCw } from 'lucide-react'
import { ChartPattern, detectChartPatterns, analyzePriceAction } from '@/utils/patternDetection'

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<'stocks' | 'options'>('stocks')
  const [stocks, setStocks] = useState<Stock[]>([])
  const [options, setOptions] = useState<Option[]>([])
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([])
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<FilterCriteria>({
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
  const [loading, setLoading] = useState(true)

  const hasActiveFilters = Object.values(filters).some(v => v !== '' && v !== undefined)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      console.log('Fetching data...')
      const [stocksRes, optionsRes] = await Promise.all([
        fetch('/api/stocks', { 
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        fetch('/api/options', { 
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ])
      
      console.log('Stocks response status:', stocksRes.status, stocksRes.ok)
      console.log('Options response status:', optionsRes.status, optionsRes.ok)
      
      if (!stocksRes.ok) {
        const errorText = await stocksRes.text()
        console.error('Stocks API error:', errorText)
        throw new Error(`Failed to fetch stocks: ${stocksRes.status} ${stocksRes.statusText}`)
      }
      if (!optionsRes.ok) {
        const errorText = await optionsRes.text()
        console.error('Options API error:', errorText)
        throw new Error(`Failed to fetch options: ${optionsRes.status} ${optionsRes.statusText}`)
      }
      
      const stocksData = await stocksRes.json()
      const optionsData = await optionsRes.json()
      
      console.log('Stocks data length:', stocksData?.length)
      console.log('Options data length:', optionsData?.length)
      
      if (!Array.isArray(stocksData)) {
        console.error('Invalid stocks data:', stocksData)
        throw new Error('Invalid stocks data format')
      }
      if (!Array.isArray(optionsData)) {
        console.error('Invalid options data:', optionsData)
        throw new Error('Invalid options data format')
      }
      
      setStocks(stocksData)
      setOptions(optionsData)
      setFilteredStocks(stocksData)
      setFilteredOptions(optionsData)
      console.log('Data loaded successfully')
    } catch (error) {
      console.error('Error fetching data:', error)
      // Set empty arrays on error to prevent loading state from persisting
      setStocks([])
      setOptions([])
      setFilteredStocks([])
      setFilteredOptions([])
    } finally {
      console.log('Setting loading to false')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Fetch initial data on mount
    console.log('Component mounted, fetching data...')
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount, not when fetchData changes

  const applyFilters = () => {
    // Filter stocks
    let filtered = [...stocks]
    
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase()
      filtered = filtered.filter(s => 
        s.symbol.toLowerCase().includes(searchLower) || 
        s.name.toLowerCase().includes(searchLower)
      )
    }
    if (filters.minPrice) {
      filtered = filtered.filter(s => s.price >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(s => s.price <= parseFloat(filters.maxPrice))
    }
    if (filters.minVolume) {
      filtered = filtered.filter(s => s.volume >= parseInt(filters.minVolume))
    }
    if (filters.minMarketCap) {
      filtered = filtered.filter(s => s.marketCap >= parseFloat(filters.minMarketCap))
    }
    if (filters.sector) {
      filtered = filtered.filter(s => s.sector.toLowerCase() === filters.sector.toLowerCase())
    }
    
    // Pattern-based filtering (requires pattern analysis for each stock)
    if (filters.priceTrend || filters.volatility || filters.chartPattern) {
      filtered = filtered.filter(s => {
        // Generate price history and analyze
        const days = 30
        const data = []
        const basePrice = s.price
        const volatility = Math.abs(s.changePercent) / 100 || 0.02
        
        for (let i = days; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const randomChange = (Math.random() - 0.5) * 2 * volatility
          const price = basePrice * (1 + randomChange * (days - i) / days)
          data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: Math.round(price * 100) / 100,
            volume: Math.floor(s.volume * (0.7 + Math.random() * 0.6)),
          })
        }
        
        const patterns = detectChartPatterns(data)
        const priceAction = analyzePriceAction(data)
        
        // Filter by trend
        if (filters.priceTrend && priceAction.trend !== filters.priceTrend) {
          return false
        }
        
        // Filter by volatility
        if (filters.volatility && priceAction.volatility !== filters.volatility) {
          return false
        }
        
        // Filter by chart pattern
        if (filters.chartPattern) {
          const hasPattern = patterns.some((p: ChartPattern) => p.type === filters.chartPattern)
          if (!hasPattern) {
            return false
          }
        }
        
        return true
      })
    }
    
    setFilteredStocks(filtered)

    // Filter options
    let filteredOpts = [...options]
    
    if (filters.minCallVolume) {
      filteredOpts = filteredOpts.filter(o => o.volume >= parseInt(filters.minCallVolume))
    }
    if (filters.maxStrikePrice) {
      filteredOpts = filteredOpts.filter(o => o.strikePrice <= parseFloat(filters.maxStrikePrice))
    }
    if (filters.minOpenInterest) {
      filteredOpts = filteredOpts.filter(o => o.openInterest >= parseInt(filters.minOpenInterest))
    }
    if (filters.expirationDate) {
      filteredOpts = filteredOpts.filter(o => o.expirationDate === filters.expirationDate)
    }
    if (filters.minIV) {
      filteredOpts = filteredOpts.filter(o => (o.impliedVolatility * 100) >= parseFloat(filters.minIV))
    }
    if (filters.maxIV) {
      filteredOpts = filteredOpts.filter(o => (o.impliedVolatility * 100) <= parseFloat(filters.maxIV))
    }
    if (filters.minDelta) {
      filteredOpts = filteredOpts.filter(o => o.delta >= parseFloat(filters.minDelta))
    }
    if (filters.maxDelta) {
      filteredOpts = filteredOpts.filter(o => o.delta <= parseFloat(filters.maxDelta))
    }
    
    setFilteredOptions(filteredOpts)
  }

  useEffect(() => {
    // Apply filters whenever filters or data change
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, stocks, options])

  return (
    <main className="h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      <Dashboard>
        <div className="h-full flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 p-2 sm:p-3 lg:p-4 lg:p-6 overflow-hidden">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden fixed bottom-4 right-4 z-40 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
            aria-label="Open filters"
          >
            <Filter className="w-6 h-6" />
          </button>

          {/* Mobile Filter Overlay */}
          {mobileFiltersOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <div 
                className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-800 shadow-xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between z-10">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
                <div className="p-4">
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={(newFilters) => {
                      setFilters(newFilters)
                      // Auto-close on mobile after applying filter (optional - can be removed if users prefer manual close)
                      // setMobileFiltersOpen(false)
                    }}
                    selectedTab={selectedTab}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Desktop Filter Panel */}
          <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              selectedTab={selectedTab}
            />
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
            <div className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 h-full flex flex-col overflow-hidden">
              {/* Mobile Filter Button in Header */}
              <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-b border-primary-200 dark:border-primary-800/30">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-slate-600 rounded-xl shadow-md transition-all"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {hasActiveFilters ? `${Object.values(filters).filter(v => v !== '' && v !== undefined).length} active` : 'No filters'}
                </div>
              </div>

              <div className="flex-shrink-0 border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex">
                  <button
                    onClick={() => setSelectedTab('stocks')}
                    className={`flex-1 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 font-bold text-xs sm:text-sm lg:text-base transition-all duration-200 relative ${
                      selectedTab === 'stocks'
                        ? 'text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-800 shadow-lg'
                        : 'text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {selectedTab === 'stocks' && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600"></div>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">📈</span>
                      <span className="hidden sm:inline">Stocks </span>
                      <span className="sm:hidden">Stocks</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        selectedTab === 'stocks'
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        {filteredStocks.length}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedTab('options')}
                    className={`flex-1 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 font-bold text-xs sm:text-sm lg:text-base transition-all duration-200 relative ${
                      selectedTab === 'options'
                        ? 'text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-800 shadow-lg'
                        : 'text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {selectedTab === 'options' && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600"></div>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">⚡</span>
                      <span className="hidden sm:inline">Options </span>
                      <span className="sm:hidden">Opts</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        selectedTab === 'options'
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        {filteredOptions.length}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto p-2 sm:p-3 lg:p-4 lg:p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 rounded-full animate-spin border-t-primary-600 dark:border-t-primary-400"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-primary-300 dark:border-primary-700 rounded-full animate-spin border-t-primary-500 dark:border-t-primary-500 animate-reverse"></div>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Loading stocks and options...</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Please wait while we fetch the data</p>
                  </div>
                ) : stocks.length === 0 && options.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 mb-4">
                      <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
                    </div>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">No data available</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-md">Unable to load stocks and options. Please check the console for errors or try again.</p>
                    <button
                      onClick={fetchData}
                      className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    {selectedTab === 'stocks' && (
                      <StockTable stocks={filteredStocks} options={options} />
                    )}
                    {selectedTab === 'options' && (
                      <OptionsTable options={filteredOptions} />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Dashboard>
    </main>
  )
}

