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
    if (!num) return '0';
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toLocaleString();
  };

  const formatPrice = (price: number) => {
    if (!price) return '$0.00';
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number, changePercent: number) => {
    if (!change || !changePercent) return '+0.00 (0.00%)';
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent.toFixed(2)}%)`;
  };

  return (
    <Card className="w-full bg-slate-800 p-6">
      <div className="space-y-6">
        <Flex alignItems="start" justifyContent="between">
          <div>
            <Text className="text-gray-400">Symbol</Text>
            <Metric className="text-white">{quote.symbol || 'N/A'}</Metric>
          </div>
          <div className="text-right">
            <Text className="text-gray-400">Price</Text>
            <Metric className="text-white">{formatPrice(quote.price)}</Metric>
          </div>
        </Flex>

        <Grid numItems={2} className="gap-4">
          <Card className="bg-slate-700">
            <Text className="text-gray-400">Change</Text>
            <Flex justifyContent="start" alignItems="baseline" className="space-x-2">
              <BadgeDelta
                deltaType={quote.change >= 0 ? 'increase' : 'decrease'}
                className="font-medium"
              >
                {formatChange(quote.change, quote.changePercent)}
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
