'use client';

import { useState } from 'react';
import StockChart from './components/StockChart';
import StockSearch from './components/StockSearch';
import StockInfo from './components/StockInfo';
import { Flex, Card } from '@tremor/react';

interface StockData {
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

export default function Home() {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStockData = async (symbol: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/stock?symbol=${encodeURIComponent(symbol)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }

      const data = await response.json();
      setStockData(data);
    } catch (err) {
      setError('Error fetching stock data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Stock Market Explorer</h1>
            <p className="text-gray-400">Enter a stock symbol to view real-time data and historical charts</p>
          </div>

          <div className="flex justify-center">
            <StockSearch onSearch={fetchStockData} />
          </div>

          {loading && (
            <Card className="bg-slate-800 p-8">
              <Flex justifyContent="center" className="h-64">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 border-4 border-t-blue-500 border-slate-700 rounded-full animate-spin"></div>
                  <div className="text-gray-400">Loading stock data...</div>
                </div>
              </Flex>
            </Card>
          )}

          {error && (
            <Card className="bg-red-900/20 border border-red-500 p-4">
              <div className="text-red-500 text-center">{error}</div>
            </Card>
          )}

          {stockData && !loading && (
            <div className="space-y-6">
              <StockInfo 
                quote={{
                  symbol: stockData.quote.symbol,
                  price: stockData.quote.regularMarketPrice,
                  change: stockData.quote.regularMarketChange,
                  changePercent: stockData.quote.regularMarketChangePercent,
                  volume: stockData.quote.regularMarketVolume,
                  marketCap: stockData.quote.marketCap
                }} 
              />
              <StockChart data={stockData.historical} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
