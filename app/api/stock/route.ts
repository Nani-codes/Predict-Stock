import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    // Fetch quote data
    const quote = await yahooFinance.quote(symbol);
    if (!quote) {
      return NextResponse.json(
        { error: 'Stock not found' },
        { status: 404 }
      );
    }

    // Fetch historical data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    const historical = await yahooFinance.historical(symbol, {
      period1: startDate,
      period2: endDate,
      interval: '1d',
    });

    // Format market cap
    const formatNumber = (num: number) => {
      if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
      if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
      if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
      return num.toLocaleString();
    };

    // Transform historical data
    const historicalData = historical.map(item => ({
      time: item.date instanceof Date 
        ? item.date.toISOString().split('T')[0]
        : new Date(item.date).toISOString().split('T')[0],
      value: Number(item.close.toFixed(2)),
    })).filter(item => !isNaN(Date.parse(item.time)));

    // Prepare response data
    const stockData = {
      symbol: quote.symbol,
      shortName: quote.shortName || quote.longName || quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      marketCap: formatNumber(quote.marketCap || 0),
      volume: formatNumber(quote.regularMarketVolume || 0),
      pe: quote.trailingPE || null,
      eps: quote.epsTrailingTwelveMonths || null,
      historicalData,
    };

    return NextResponse.json(stockData);
  } catch (error) {
    console.error('Stock API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}
