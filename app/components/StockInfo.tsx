'use client';

import { Card, Text, Metric, Flex, Grid, BadgeDelta } from '@tremor/react';

interface StockInfoProps {
  quote: {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap?: number;
  };
}

const StockInfo = ({ quote }: StockInfoProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toLocaleString();
  };

  return (
    <Card className="w-full bg-slate-800 p-6">
      <div className="space-y-6">
        <Flex alignItems="start" justifyContent="between">
          <div>
            <Text className="text-gray-400">Symbol</Text>
            <Metric className="text-white">{quote.symbol}</Metric>
          </div>
          <div className="text-right">
            <Text className="text-gray-400">Price</Text>
            <Metric className="text-white">${quote.price.toFixed(2)}</Metric>
          </div>
        </Flex>

        <Grid numItems={2} className="gap-4">
          <Card className="bg-slate-700">
            <Text className="text-gray-400">Change</Text>
            <Flex justifyContent="start" alignItems="baseline" className="space-x-2">
              <Metric className={quote.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                ${Math.abs(quote.change).toFixed(2)}
              </Metric>
              <BadgeDelta
                deltaType={quote.change >= 0 ? 'increase' : 'decrease'}
                className="font-medium"
              >
                {quote.changePercent.toFixed(2)}%
              </BadgeDelta>
            </Flex>
          </Card>

          <Card className="bg-slate-700">
            <Text className="text-gray-400">Volume</Text>
            <Metric className="text-white">{formatNumber(quote.volume)}</Metric>
          </Card>

          {quote.marketCap && (
            <Card className="bg-slate-700">
              <Text className="text-gray-400">Market Cap</Text>
              <Metric className="text-white">{formatNumber(quote.marketCap)}</Metric>
            </Card>
          )}
        </Grid>
      </div>
    </Card>
  );
};

export default StockInfo;
