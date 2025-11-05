import { NextResponse } from 'next/server'
import { Option } from '@/types'

// Mock options data - In production, replace with real API calls
const generateMockOptions = (): Option[] => {
  const options: Option[] = []
  const underlyings = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'SPY', 'QQQ']
  const types: ('call' | 'put')[] = ['call', 'put']
  
  // Generate expiration dates (next 4 Fridays)
  const today = new Date()
  const nextFridays: string[] = []
  for (let i = 0; i < 4; i++) {
    const date = new Date(today)
    const daysUntilFriday = (5 - date.getDay() + 7) % 7 || 7
    date.setDate(date.getDate() + daysUntilFriday + (i * 7))
    nextFridays.push(date.toISOString().split('T')[0])
  }

  underlyings.forEach((underlying) => {
    types.forEach((type) => {
      // Generate multiple strike prices around current price
      const basePrice = underlying === 'AAPL' ? 180 : 
                        underlying === 'MSFT' ? 380 :
                        underlying === 'GOOGL' ? 145 :
                        underlying === 'AMZN' ? 150 :
                        underlying === 'TSLA' ? 250 :
                        underlying === 'META' ? 490 :
                        underlying === 'NVDA' ? 500 :
                        underlying === 'SPY' ? 450 :
                        150
      
      const strikes = [
        basePrice * 0.85,
        basePrice * 0.90,
        basePrice * 0.95,
        basePrice,
        basePrice * 1.05,
        basePrice * 1.10,
        basePrice * 1.15,
      ]

      strikes.forEach((strike) => {
        nextFridays.forEach((expDate) => {
          const bid = Math.random() * 10 + 0.5
          const ask = bid + Math.random() * 2 + 0.1
          const lastPrice = bid + (ask - bid) * Math.random()
          
          // Calculate delta based on moneyness (strike relative to base price)
          // For calls: higher delta when strike < basePrice (ITM), lower when strike > basePrice (OTM)
          // For puts: higher delta (negative) when strike > basePrice (ITM), lower when strike < basePrice (OTM)
          const moneyness = strike / basePrice
          let delta: number
          if (type === 'call') {
            // Call delta: 0.05 (deep OTM) to 0.95 (deep ITM)
            delta = moneyness < 0.9 ? 0.8 + (0.9 - moneyness) * 0.5 : 
                   moneyness < 1.1 ? 0.5 + (1.1 - moneyness) * 0.3 : 
                   0.05 + (1.3 - moneyness) * 0.45
            delta = Math.max(0.05, Math.min(0.95, delta))
          } else {
            // Put delta: -0.95 (deep ITM) to -0.05 (deep OTM)
            delta = moneyness > 1.1 ? -0.8 - (moneyness - 1.1) * 0.5 :
                   moneyness > 0.9 ? -0.5 - (moneyness - 0.9) * 0.3 :
                   -0.05 - (moneyness - 0.7) * 0.45
            delta = Math.max(-0.95, Math.min(-0.05, delta))
          }
          
          options.push({
            symbol: `${underlying}${expDate.replace(/-/g, '').slice(2)}${type === 'call' ? 'C' : 'P'}${Math.round(strike).toString().padStart(8, '0')}`,
            underlying,
            type,
            strikePrice: Math.round(strike * 100) / 100,
            expirationDate: expDate,
            bid: Math.round(bid * 100) / 100,
            ask: Math.round(ask * 100) / 100,
            lastPrice: Math.round(lastPrice * 100) / 100,
            volume: Math.floor(Math.random() * 5000) + 100,
            openInterest: Math.floor(Math.random() * 20000) + 500,
            impliedVolatility: Math.random() * 0.5 + 0.15, // 15% - 65%
            delta: Math.round(delta * 100) / 100,
          })
        })
      })
    })
  })

  return options.sort((a, b) => {
    if (a.underlying !== b.underlying) {
      return a.underlying.localeCompare(b.underlying)
    }
    if (a.expirationDate !== b.expirationDate) {
      return a.expirationDate.localeCompare(b.expirationDate)
    }
    return a.strikePrice - b.strikePrice
  })
}

export async function GET() {
  try {
    // In production, replace this with actual API calls
    // Example: const response = await fetch('https://api.example.com/options')
    const options = generateMockOptions()
    
    return NextResponse.json(options)
  } catch (error) {
    console.error('Error fetching options:', error)
    return NextResponse.json(
      { error: 'Failed to fetch options' },
      { status: 500 }
    )
  }
}

