# Stock Market Explorer 📈

A modern, interactive stock market exploration tool built with Next.js, TypeScript, and Tailwind CSS. Get real-time stock data, view historical price charts, and analyze market trends with a beautiful, responsive interface.

## 🚀 Features

- **Real-time Stock Data**: Get up-to-date stock prices, changes, and market statistics
- **Interactive Charts**: View historical price data with candlestick charts
- **Responsive Design**: Beautiful UI that works on desktop and mobile devices
- **Type-Safe**: Built with TypeScript for better code reliability
- **Modern Stack**: Uses Next.js 15 with App Router and Server Components

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Tremor Components
- **Charts**: Lightweight Charts
- **Data**: Yahoo Finance API
- **Development**: ESLint, PostCSS

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stock-market-explorer.git
   cd stock-market-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

1. Enter a stock symbol (e.g., "AAPL" for Apple Inc.) in the search bar
2. View real-time stock information including:
   - Current price
   - Price change and percentage
   - Trading volume
   - Market capitalization
3. Explore the interactive candlestick chart showing 6 months of historical data
4. Hover over the chart to see detailed price information

## 📊 API Reference

The application uses the following API endpoints:

### GET /api/stock
Fetches stock data for a given symbol.

**Query Parameters:**
- `symbol` (required): Stock symbol (e.g., "AAPL")

**Response:**
```typescript
{
  historical: {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
  quote: {
    symbol: string;
    shortName: string;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    regularMarketVolume: number;
    marketCap?: number;
  };
}
```

## 🔧 Configuration

The project uses various configuration files:

- `next.config.ts`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `postcss.config.mjs`: PostCSS configuration
- `eslint.config.mjs`: ESLint configuration

## 🧪 Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

### Starting Production Server
```bash
npm start
```

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices
- 💻 Tablets
- 🖥️ Desktop computers

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Yahoo Finance API](https://github.com/gadicc/node-yahoo-finance2) for providing stock data
- [Tremor](https://www.tremor.so/) for beautiful UI components
- [Lightweight Charts](https://www.tradingview.com/lightweight-charts/) for the charting library
