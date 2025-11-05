'use client'

import { useState, useEffect } from 'react'
import Dashboard from '@/components/Dashboard'
import FilterPanel from '@/components/FilterPanel'
import StockTable from '@/components/StockTable'
import OptionsTable from '@/components/OptionsTable'
import { Stock, Option, FilterCriteria } from '@/types'

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<'stocks' | 'options'>('stocks')
  const [stocks, setStocks] = useState<Stock[]>([])
  const [options, setOptions] = useState<Option[]>([])
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([])
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([])
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
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial data
    fetchData()
  }, [])

  useEffect(() => {
    // Apply filters whenever filters or data change
    applyFilters()
  }, [filters, stocks, options])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [stocksRes, optionsRes] = await Promise.all([
        fetch('/api/stocks'),
        fetch('/api/options'),
      ])
      const stocksData = await stocksRes.json()
      const optionsData = await optionsRes.json()
      setStocks(stocksData)
      setOptions(optionsData)
      setFilteredStocks(stocksData)
      setFilteredOptions(optionsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <main className="h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      <Dashboard>
        <div className="h-full flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6 overflow-hidden">
          <div className="lg:w-80 lg:flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              selectedTab={selectedTab}
            />
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg h-full flex flex-col overflow-hidden">
              <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-700">
                <div className="flex">
                  <button
                    onClick={() => setSelectedTab('stocks')}
                    className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base transition-colors ${
                      selectedTab === 'stocks'
                        ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    Stocks ({filteredStocks.length})
                  </button>
                  <button
                    onClick={() => setSelectedTab('options')}
                    className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base transition-colors ${
                      selectedTab === 'options'
                        ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    Options ({filteredOptions.length})
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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

