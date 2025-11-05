export interface ChartPattern {
  type: string
  confidence: number
  description: string
  signal: 'bullish' | 'bearish' | 'neutral'
  startIndex: number
  endIndex: number
}

export interface PriceAction {
  supportLevels: number[]
  resistanceLevels: number[]
  trend: 'uptrend' | 'downtrend' | 'sideways'
  volatility: 'low' | 'medium' | 'high'
}

export interface PriceData {
  date: string
  price: number
  volume: number
}

// Detect chart patterns in price data
export function detectChartPatterns(data: PriceData[]): ChartPattern[] {
  const patterns: ChartPattern[] = []
  
  if (data.length < 10) return patterns
  
  const prices = data.map(d => d.price)
  const volumes = data.map(d => d.volume)
  
  // Detect Head and Shoulders
  const headAndShoulders = detectHeadAndShoulders(prices)
  if (headAndShoulders) patterns.push(headAndShoulders)
  
  // Detect Double Top/Bottom
  const doubleTop = detectDoubleTop(prices)
  if (doubleTop) patterns.push(doubleTop)
  
  const doubleBottom = detectDoubleBottom(prices)
  if (doubleBottom) patterns.push(doubleBottom)
  
  // Detect Triangles
  const ascendingTriangle = detectAscendingTriangle(prices)
  if (ascendingTriangle) patterns.push(ascendingTriangle)
  
  const descendingTriangle = detectDescendingTriangle(prices)
  if (descendingTriangle) patterns.push(descendingTriangle)
  
  const symmetricalTriangle = detectSymmetricalTriangle(prices)
  if (symmetricalTriangle) patterns.push(symmetricalTriangle)
  
  // Detect Flags and Pennants
  const bullishFlag = detectBullishFlag(prices, volumes)
  if (bullishFlag) patterns.push(bullishFlag)
  
  const bearishFlag = detectBearishFlag(prices, volumes)
  if (bearishFlag) patterns.push(bearishFlag)
  
  // Detect Cup and Handle
  const cupAndHandle = detectCupAndHandle(prices)
  if (cupAndHandle) patterns.push(cupAndHandle)
  
  // Detect Wedges
  const risingWedge = detectRisingWedge(prices)
  if (risingWedge) patterns.push(risingWedge)
  
  const fallingWedge = detectFallingWedge(prices)
  if (fallingWedge) patterns.push(fallingWedge)
  
  return patterns
}

// Analyze price action
export function analyzePriceAction(data: PriceData[]): PriceAction {
  if (data.length < 5) {
    return {
      supportLevels: [],
      resistanceLevels: [],
      trend: 'sideways',
      volatility: 'medium'
    }
  }
  
  const prices = data.map(d => d.price)
  const supportLevels = findSupportLevels(prices)
  const resistanceLevels = findResistanceLevels(prices)
  const trend = determineTrend(prices)
  const volatility = calculateVolatility(prices)
  
  return {
    supportLevels,
    resistanceLevels,
    trend,
    volatility
  }
}

// Helper functions for pattern detection
function detectHeadAndShoulders(prices: number[]): ChartPattern | null {
  if (prices.length < 15) return null
  
  // Look for peak-trough-peak pattern where middle peak is highest
  for (let i = 5; i < prices.length - 5; i++) {
    const leftShoulder = findLocalMax(prices, i - 5, i)
    const head = findLocalMax(prices, i, i + 5)
    const rightShoulder = findLocalMax(prices, i + 5, i + 10)
    
    if (leftShoulder && head && rightShoulder && 
        head.value > leftShoulder.value && 
        head.value > rightShoulder.value &&
        Math.abs(leftShoulder.value - rightShoulder.value) / leftShoulder.value < 0.05) {
      return {
        type: 'Head and Shoulders',
        confidence: 0.75,
        description: 'Bearish reversal pattern - indicates potential downward trend',
        signal: 'bearish',
        startIndex: leftShoulder.index - 5,
        endIndex: rightShoulder.index + 5
      }
    }
  }
  return null
}

function detectDoubleTop(prices: number[]): ChartPattern | null {
  if (prices.length < 10) return null
  
  const maxPrice = Math.max(...prices)
  const maxIndices = prices
    .map((p, i) => ({ price: p, index: i }))
    .filter(p => Math.abs(p.price - maxPrice) / maxPrice < 0.02)
  
  if (maxIndices.length >= 2 && maxIndices[1].index - maxIndices[0].index > 3) {
    return {
      type: 'Double Top',
      confidence: 0.70,
      description: 'Bearish reversal pattern - two peaks at similar resistance level',
      signal: 'bearish',
      startIndex: maxIndices[0].index - 3,
      endIndex: maxIndices[1].index + 3
    }
  }
  return null
}

function detectDoubleBottom(prices: number[]): ChartPattern | null {
  if (prices.length < 10) return null
  
  const minPrice = Math.min(...prices)
  const minIndices = prices
    .map((p, i) => ({ price: p, index: i }))
    .filter(p => Math.abs(p.price - minPrice) / minPrice < 0.02)
  
  if (minIndices.length >= 2 && minIndices[1].index - minIndices[0].index > 3) {
    return {
      type: 'Double Bottom',
      confidence: 0.70,
      description: 'Bullish reversal pattern - two troughs at similar support level',
      signal: 'bullish',
      startIndex: minIndices[0].index - 3,
      endIndex: minIndices[1].index + 3
    }
  }
  return null
}

function detectAscendingTriangle(prices: number[]): ChartPattern | null {
  if (prices.length < 10) return null
  
  const firstHalf = prices.slice(0, Math.floor(prices.length / 2))
  const secondHalf = prices.slice(Math.floor(prices.length / 2))
  
  const firstMax = Math.max(...firstHalf)
  const secondMax = Math.max(...secondHalf)
  const firstMin = Math.min(...firstHalf)
  const secondMin = Math.min(...secondHalf)
  
  // Ascending triangle: resistance similar, support rising
  if (Math.abs(firstMax - secondMax) / firstMax < 0.03 && 
      secondMin > firstMin && (secondMin - firstMin) / firstMin > 0.02) {
    return {
      type: 'Ascending Triangle',
      confidence: 0.65,
      description: 'Bullish continuation pattern - resistance level with rising support',
      signal: 'bullish',
      startIndex: 0,
      endIndex: prices.length - 1
    }
  }
  return null
}

function detectDescendingTriangle(prices: number[]): ChartPattern | null {
  if (prices.length < 10) return null
  
  const firstHalf = prices.slice(0, Math.floor(prices.length / 2))
  const secondHalf = prices.slice(Math.floor(prices.length / 2))
  
  const firstMax = Math.max(...firstHalf)
  const secondMax = Math.max(...secondHalf)
  const firstMin = Math.min(...firstHalf)
  const secondMin = Math.min(...secondHalf)
  
  // Descending triangle: support similar, resistance falling
  if (Math.abs(firstMin - secondMin) / firstMin < 0.03 && 
      secondMax < firstMax && (firstMax - secondMax) / firstMax > 0.02) {
    return {
      type: 'Descending Triangle',
      confidence: 0.65,
      description: 'Bearish continuation pattern - support level with falling resistance',
      signal: 'bearish',
      startIndex: 0,
      endIndex: prices.length - 1
    }
  }
  return null
}

function detectSymmetricalTriangle(prices: number[]): ChartPattern | null {
  if (prices.length < 10) return null
  
  const firstHalf = prices.slice(0, Math.floor(prices.length / 2))
  const secondHalf = prices.slice(Math.floor(prices.length / 2))
  
  const firstRange = Math.max(...firstHalf) - Math.min(...firstHalf)
  const secondRange = Math.max(...secondHalf) - Math.min(...secondHalf)
  
  // Symmetrical triangle: converging price range
  if (secondRange < firstRange * 0.7) {
    return {
      type: 'Symmetrical Triangle',
      confidence: 0.60,
      description: 'Neutral pattern - price consolidation, breakout direction uncertain',
      signal: 'neutral',
      startIndex: 0,
      endIndex: prices.length - 1
    }
  }
  return null
}

function detectBullishFlag(prices: number[], volumes: number[]): ChartPattern | null {
  if (prices.length < 8) return null
  
  // Bullish flag: strong upward move followed by slight downward consolidation
  const firstQuarter = prices.slice(0, Math.floor(prices.length / 4))
  const lastQuarter = prices.slice(Math.floor(prices.length * 3 / 4))
  
  const firstAvg = firstQuarter.reduce((a, b) => a + b, 0) / firstQuarter.length
  const lastAvg = lastQuarter.reduce((a, b) => a + b, 0) / lastQuarter.length
  
  if (lastAvg > firstAvg * 1.05) {
    return {
      type: 'Bullish Flag',
      confidence: 0.68,
      description: 'Bullish continuation pattern - brief consolidation after strong uptrend',
      signal: 'bullish',
      startIndex: Math.floor(prices.length / 4),
      endIndex: prices.length - 1
    }
  }
  return null
}

function detectBearishFlag(prices: number[], volumes: number[]): ChartPattern | null {
  if (prices.length < 8) return null
  
  // Bearish flag: strong downward move followed by slight upward consolidation
  const firstQuarter = prices.slice(0, Math.floor(prices.length / 4))
  const lastQuarter = prices.slice(Math.floor(prices.length * 3 / 4))
  
  const firstAvg = firstQuarter.reduce((a, b) => a + b, 0) / firstQuarter.length
  const lastAvg = lastQuarter.reduce((a, b) => a + b, 0) / lastQuarter.length
  
  if (lastAvg < firstAvg * 0.95) {
    return {
      type: 'Bearish Flag',
      confidence: 0.68,
      description: 'Bearish continuation pattern - brief consolidation after strong downtrend',
      signal: 'bearish',
      startIndex: Math.floor(prices.length / 4),
      endIndex: prices.length - 1
    }
  }
  return null
}

function detectCupAndHandle(prices: number[]): ChartPattern | null {
  if (prices.length < 15) return null
  
  // Look for U-shaped pattern (cup) followed by small consolidation (handle)
  const midPoint = Math.floor(prices.length / 2)
  const cup = prices.slice(0, midPoint)
  const handle = prices.slice(midPoint)
  
  const cupStart = cup[0]
  const cupEnd = cup[cup.length - 1]
  const cupMin = Math.min(...cup)
  
  // Cup should have similar start/end prices and a dip in the middle
  if (Math.abs(cupStart - cupEnd) / cupStart < 0.05 && 
      cupMin < cupStart * 0.9 && handle.length > 2) {
    return {
      type: 'Cup and Handle',
      confidence: 0.72,
      description: 'Bullish continuation pattern - rounded bottom followed by consolidation',
      signal: 'bullish',
      startIndex: 0,
      endIndex: prices.length - 1
    }
  }
  return null
}

function detectRisingWedge(prices: number[]): ChartPattern | null {
  if (prices.length < 10) return null
  
  // Rising wedge: both support and resistance rising, but converging
  const firstHalf = prices.slice(0, Math.floor(prices.length / 2))
  const secondHalf = prices.slice(Math.floor(prices.length / 2))
  
  const firstRange = Math.max(...firstHalf) - Math.min(...firstHalf)
  const secondRange = Math.max(...secondHalf) - Math.min(...secondHalf)
  
  if (secondRange < firstRange * 0.6 && 
      Math.min(...secondHalf) > Math.min(...firstHalf)) {
    return {
      type: 'Rising Wedge',
      confidence: 0.65,
      description: 'Bearish reversal pattern - upward trend with converging lines',
      signal: 'bearish',
      startIndex: 0,
      endIndex: prices.length - 1
    }
  }
  return null
}

function detectFallingWedge(prices: number[]): ChartPattern | null {
  if (prices.length < 10) return null
  
  // Falling wedge: both support and resistance falling, but converging
  const firstHalf = prices.slice(0, Math.floor(prices.length / 2))
  const secondHalf = prices.slice(Math.floor(prices.length / 2))
  
  const firstRange = Math.max(...firstHalf) - Math.min(...firstHalf)
  const secondRange = Math.max(...secondHalf) - Math.min(...secondHalf)
  
  if (secondRange < firstRange * 0.6 && 
      Math.max(...secondHalf) < Math.max(...firstHalf)) {
    return {
      type: 'Falling Wedge',
      confidence: 0.65,
      description: 'Bullish reversal pattern - downward trend with converging lines',
      signal: 'bullish',
      startIndex: 0,
      endIndex: prices.length - 1
    }
  }
  return null
}

// Helper functions
function findLocalMax(prices: number[], start: number, end: number): { value: number, index: number } | null {
  let max = prices[start]
  let maxIndex = start
  for (let i = start; i < end && i < prices.length; i++) {
    if (prices[i] > max) {
      max = prices[i]
      maxIndex = i
    }
  }
  return maxIndex > start && maxIndex < end - 1 ? { value: max, index: maxIndex } : null
}

function findSupportLevels(prices: number[]): number[] {
  const supports: number[] = []
  const threshold = (Math.max(...prices) - Math.min(...prices)) * 0.05
  
  for (let i = 1; i < prices.length - 1; i++) {
    if (prices[i] < prices[i - 1] && prices[i] < prices[i + 1]) {
      const support = prices[i]
      if (!supports.some(s => Math.abs(s - support) < threshold)) {
        supports.push(support)
      }
    }
  }
  
  return supports.sort((a, b) => a - b).slice(-3) // Return top 3 support levels
}

function findResistanceLevels(prices: number[]): number[] {
  const resistances: number[] = []
  const threshold = (Math.max(...prices) - Math.min(...prices)) * 0.05
  
  for (let i = 1; i < prices.length - 1; i++) {
    if (prices[i] > prices[i - 1] && prices[i] > prices[i + 1]) {
      const resistance = prices[i]
      if (!resistances.some(r => Math.abs(r - resistance) < threshold)) {
        resistances.push(resistance)
      }
    }
  }
  
  return resistances.sort((a, b) => b - a).slice(0, 3) // Return top 3 resistance levels
}

function determineTrend(prices: number[]): 'uptrend' | 'downtrend' | 'sideways' {
  const firstThird = prices.slice(0, Math.floor(prices.length / 3))
  const lastThird = prices.slice(Math.floor(prices.length * 2 / 3))
  
  const firstAvg = firstThird.reduce((a, b) => a + b, 0) / firstThird.length
  const lastAvg = lastThird.reduce((a, b) => a + b, 0) / lastThird.length
  
  const change = (lastAvg - firstAvg) / firstAvg
  
  if (change > 0.02) return 'uptrend'
  if (change < -0.02) return 'downtrend'
  return 'sideways'
}

function calculateVolatility(prices: number[]): 'low' | 'medium' | 'high' {
  const returns = []
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.abs((prices[i] - prices[i - 1]) / prices[i - 1]))
  }
  
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
  
  if (avgReturn < 0.01) return 'low'
  if (avgReturn > 0.03) return 'high'
  return 'medium'
}

