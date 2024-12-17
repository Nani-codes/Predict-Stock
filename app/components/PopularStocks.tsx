'use client';

import { useEffect, useState } from 'react';
import { Card, Title, Text, Grid, Flex, Badge } from '@tremor/react';

interface Stock {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
}

export default function PopularStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPopularStocks = async () => {
      try {
        const response = await fetch('/api/popular');
        if (!response.ok) throw new Error('Failed to fetch popular stocks');
        const data = await response.json();
        setStocks(data);
      } catch (err) {
        setError('Failed to load popular stocks');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularStocks();
  }, []);

  if (loading) {
    return (
      <Card className="mt-6">
        <Text>Loading popular stocks...</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-6">
        <Text color="red">{error}</Text>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <Title>Popular Stocks</Title>
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6 mt-6">
        {stocks.map((stock) => (
          <Card key={stock.symbol} decoration="top" decorationColor={parseFloat(stock.change) >= 0 ? "green" : "red"}>
            <Flex justifyContent="between" alignItems="center">
              <div>
                <Text>{stock.symbol}</Text>
                <Text className="text-sm text-gray-500">{stock.name}</Text>
              </div>
              <Badge color={parseFloat(stock.change) >= 0 ? "green" : "red"}>
                {parseFloat(stock.change) >= 0 ? "+" : ""}{stock.changePercent}%
              </Badge>
            </Flex>
            <Flex justifyContent="between" className="mt-4">
              <Text className="font-medium">${stock.price}</Text>
              <Text color={parseFloat(stock.change) >= 0 ? "green" : "red"}>
                {parseFloat(stock.change) >= 0 ? "+" : ""}{stock.change}
              </Text>
            </Flex>
          </Card>
        ))}
      </Grid>
    </Card>
  );
}
