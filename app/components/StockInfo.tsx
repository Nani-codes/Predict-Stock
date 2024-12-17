'use client';

import { Card, Grid, Metric, Text, BadgeDelta, Flex } from '@tremor/react';

interface StockInfoProps {
  data: {
    symbol: string;
    shortName: string;
    price: number;
    change: number;
    changePercent: number;
    marketCap: string;
    volume: string;
    pe: number | null;
    eps: number | null;
  };
}

export default function StockInfo({ data }: StockInfoProps) {
  if (!data || typeof data.price === 'undefined') {
    return null;
  }

  const getDeltaType = (value: number) => {
    if (value > 0) return 'increase';
    if (value < 0) return 'decrease';
    return 'unchanged';
  };

  return (
    <Card className="mt-6 bg-slate-800 border-gray-700">
      <div className="space-y-6">
        <div>
          <Text className="text-gray-400">Stock Price</Text>
          <Flex
            justifyContent="start"
            alignItems="baseline"
            className="space-x-3 truncate"
          >
            <Metric className="text-white">
              ${(data.price || 0).toFixed(2)}
            </Metric>
            <BadgeDelta
              deltaType={getDeltaType(data.change || 0)}
              className="font-medium"
            >
              {(data.change || 0).toFixed(2)} ({(data.changePercent || 0).toFixed(2)}%)
            </BadgeDelta>
          </Flex>
        </div>

        <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
          <div>
            <Text className="text-gray-400">Market Cap</Text>
            <Text className="text-white font-medium">{data.marketCap || 'N/A'}</Text>
          </div>
          <div>
            <Text className="text-gray-400">Volume</Text>
            <Text className="text-white font-medium">{data.volume || 'N/A'}</Text>
          </div>
          <div>
            <Text className="text-gray-400">P/E Ratio</Text>
            <Text className="text-white font-medium">
              {data.pe ? data.pe.toFixed(2) : 'N/A'}
            </Text>
          </div>
          <div>
            <Text className="text-gray-400">EPS</Text>
            <Text className="text-white font-medium">
              {data.eps ? `$${data.eps.toFixed(2)}` : 'N/A'}
            </Text>
          </div>
        </Grid>
      </div>
    </Card>
  );
}
