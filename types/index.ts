export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  sector: string
  peRatio: number
  dividendYield: number
}

export interface Option {
  symbol: string
  underlying: string
  type: 'call' | 'put'
  strikePrice: number
  expirationDate: string
  bid: number
  ask: number
  lastPrice: number
  volume: number
  openInterest: number
  impliedVolatility: number
  delta: number
}

export interface FilterCriteria {
  minPrice: string
  maxPrice: string
  minVolume: string
  minMarketCap: string
  sector: string
  minCallVolume: string
  maxStrikePrice: string
  minOpenInterest: string
  expirationDate: string
  minIV: string
  maxIV: string
  minDelta: string
  maxDelta: string
}

