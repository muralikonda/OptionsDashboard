# Options Dashboard

A modern, responsive dashboard for screening stocks and options with advanced filtering capabilities.

## Features

- **Stock Screening**: Filter stocks by price range, volume, market cap, and sector
- **Options Screening**: Filter options by volume, strike price, open interest, and expiration date
- **Real-time Data**: Built with Next.js for optimal performance
- **Modern UI**: Beautiful, responsive design with dark mode support
- **Advanced Filters**: Multiple filter criteria for precise screening

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
OptionsDashboard/
├── app/
│   ├── api/
│   │   ├── stocks/route.ts    # Stock data API
│   │   └── options/route.ts    # Options data API
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main dashboard page
├── components/
│   ├── Dashboard.tsx           # Dashboard layout component
│   ├── FilterPanel.tsx         # Filter sidebar component
│   ├── StockTable.tsx          # Stock data table
│   └── OptionsTable.tsx        # Options data table
├── types/
│   └── index.ts                # TypeScript type definitions
└── package.json
```

## Customization

### Connecting to Real Data APIs

The current implementation uses mock data. To connect to real APIs:

1. **Stock Data**: Update `app/api/stocks/route.ts` to fetch from your preferred API (Alpha Vantage, Yahoo Finance, etc.)
2. **Options Data**: Update `app/api/options/route.ts` to fetch from your options data provider

Example for real API integration:
```typescript
export async function GET() {
  const apiKey = process.env.STOCK_API_KEY
  const response = await fetch(`https://api.example.com/stocks?apikey=${apiKey}`)
  const data = await response.json()
  return NextResponse.json(data)
}
```

### Adding More Filters

To add additional filters:

1. Update the `FilterCriteria` interface in `types/index.ts`
2. Add filter inputs in `components/FilterPanel.tsx`
3. Implement filter logic in `app/page.tsx`

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## License

MIT

