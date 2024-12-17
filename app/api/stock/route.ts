import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

yahooFinance.setGlobalConfig({
  queue: {
    concurrency: 1,
    timeout: 60000
  }
});

interface HistoricalDataItem {
  date: Date;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
  adjclose?: number | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    console.log('Fetching data for symbol:', symbol);
    const [historical, quote] = await Promise.all([
      yahooFinance.chart(symbol, {
        period1: startDate,
        period2: endDate,
        interval: '1d'
      }),
      yahooFinance.quote(symbol)
    ]);

    console.log('Quote data:', quote);

    // Check if we have the expected data structure
    if (!historical.quotes || !Array.isArray(historical.quotes)) {
      console.error('Unexpected historical data structure:', historical);
      throw new Error('Invalid historical data structure');
    }

    // Filter out any invalid data points and format the date
    const validHistoricalData = historical.quotes
      .filter((item: HistoricalDataItem) => {
        const isValid = item &&
          typeof item.open === 'number' && item.open !== null && !isNaN(item.open) &&
          typeof item.high === 'number' && item.high !== null && !isNaN(item.high) &&
          typeof item.low === 'number' && item.low !== null && !isNaN(item.low) &&
          typeof item.close === 'number' && item.close !== null && !isNaN(item.close) &&
          item.date;

        if (!isValid) {
          console.log('Invalid item:', item);
        }
        return isValid;
      })
      .map((item: HistoricalDataItem) => {
        const dateStr = item.date.toISOString ? 
          item.date.toISOString() : 
          new Date(item.date).toISOString();
        
        return {
          time: dateStr.split('T')[0],
          open: item.open!,
          high: item.high!,
          low: item.low!,
          close: item.close!,
        };
      });

    if (!validHistoricalData.length) {
      console.error('No valid data points found in:', historical.quotes);
      throw new Error('No valid historical data points');
    }

    const response = {
      historical: validHistoricalData,
      quote: {
        symbol: quote.symbol,
        shortName: quote.shortName,
        regularMarketPrice: quote.regularMarketPrice,
        regularMarketChange: quote.regularMarketChange,
        regularMarketChangePercent: quote.regularMarketChangePercent,
        regularMarketVolume: quote.regularMarketVolume,
        marketCap: quote.marketCap
      }
    };

    console.log('Sending response:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}
