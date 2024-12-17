import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

yahooFinance.setGlobalConfig({
  queue: {
    concurrency: 1,
    timeout: 60000
  }
});

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

    const [historical, quote] = await Promise.all([
      yahooFinance.chart(symbol, {
        period1: startDate,
        period2: endDate,
        interval: '1d'
      }),
      yahooFinance.quote(symbol)
    ]);

    // Check if we have the expected data structure
    if (!historical.quotes || !Array.isArray(historical.quotes)) {
      console.error('Unexpected historical data structure:', historical);
      throw new Error('Invalid historical data structure');
    }

    // Filter out any invalid data points and format the date
    const validHistoricalData = historical.quotes
      .filter((item: any) => {
        const isValid = item &&
          typeof item.open === 'number' && !isNaN(item.open) &&
          typeof item.high === 'number' && !isNaN(item.high) &&
          typeof item.low === 'number' && !isNaN(item.low) &&
          typeof item.close === 'number' && !isNaN(item.close) &&
          item.date; // Check if date exists

        if (!isValid) {
          console.log('Invalid item:', item);
        }
        return isValid;
      })
      .map((item: any) => {
        // Handle the date string format
        const dateStr = item.date.toISOString ? 
          item.date.toISOString() : 
          new Date(item.date).toISOString();
        
        return {
          time: dateStr.split('T')[0],
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        };
      });

    if (!validHistoricalData.length) {
      console.error('No valid data points found in:', historical.quotes);
      throw new Error('No valid historical data available');
    }

    return NextResponse.json({
      historical: validHistoricalData,
      quote: {
        symbol: quote.symbol,
        price: Number(quote.regularMarketPrice) || 0,
        change: Number(quote.regularMarketChange) || 0,
        changePercent: Number(quote.regularMarketChangePercent) || 0,
        volume: Number(quote.regularMarketVolume) || 0,
        marketCap: Number(quote.marketCap) || undefined,
      }
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}
