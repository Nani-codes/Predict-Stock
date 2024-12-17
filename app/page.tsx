'use client';

import { useState } from 'react';
import { Card, Title, Text } from '@tremor/react';
import { FiTrendingUp, FiClock, FiSmartphone, FiDatabase } from 'react-icons/fi';
import StockSearch from './components/StockSearch';
import StockChart from './components/StockChart';
import StockInfo from './components/StockInfo';
import LoadingSkeleton from './components/LoadingSkeleton';

interface StockData {
  symbol: string;
  shortName: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  volume: string;
  pe: number | null;
  eps: number | null;
  historicalData: Array<{
    time: string;
    value: number;
  }>;
}

export default function Home() {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (symbol: string) => {
    setLoading(true);
    setError(null);
    setStockData(null);

    try {
      const response = await fetch(`/api/stock?symbol=${encodeURIComponent(symbol)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch stock data');
      }
      const data = await response.json();
      setStockData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching stock data. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: FiTrendingUp,
      title: 'Real-Time Data',
      description: 'Get up-to-the-minute stock prices and market data',
    },
    {
      icon: FiClock,
      title: 'Historical Charts',
      description: 'View detailed historical price trends and patterns',
    },
    {
      icon: FiSmartphone,
      title: 'Mobile Friendly',
      description: 'Access your stocks on any device, anywhere',
    },
    {
      icon: FiDatabase,
      title: 'Rich Data',
      description: 'Comprehensive financial metrics and analysis',
    },
  ];

  return (
    <main className="min-h-screen p-4 sm:p-10 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Title className="text-4xl sm:text-5xl font-bold text-white">
            Stock Market Explorer
          </Title>
          <Text className="text-xl text-gray-400">
            Track real-time stock prices and analyze market trends
          </Text>
        </div>

        {/* Search */}
        <StockSearch onSearch={handleSearch} />

        {/* Features Grid */}
        {!loading && !stockData && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-slate-800 border-gray-700 hover:bg-slate-700 transition-colors"
              >
                <div className="flex flex-col items-center text-center p-4 space-y-2">
                  <feature.icon className="w-8 h-8 text-blue-500" />
                  <Text className="text-lg font-medium text-white">
                    {feature.title}
                  </Text>
                  <Text className="text-gray-400">{feature.description}</Text>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Error Message */}
        {error && (
          <Card className="bg-red-900/50 border-red-700">
            <Text className="text-red-200">{error}</Text>
          </Card>
        )}

        {/* Stock Data */}
        {!loading && stockData && (
          <div>
            <StockInfo data={stockData} />
            <StockChart
              data={stockData.historicalData}
              symbol={stockData.symbol}
              companyName={stockData.shortName}
            />
          </div>
        )}
      </div>
    </main>
  );
}
