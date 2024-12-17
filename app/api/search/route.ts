import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

interface YahooSearchResult {
  symbol: string;
  shortName?: string;
  longName?: string;
  typeDisp?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    const results = await yahooFinance.search(query, {
      newsCount: 0,
      quotesCount: 10,
      enableNavLinks: false,
      enableEnhancedTrivialQuery: true,
    });

    // Filter and format the results
    const suggestions = (results.quotes as YahooSearchResult[])
      .filter(quote => quote.typeDisp === 'Equity')
      .map(quote => ({
        symbol: quote.symbol,
        shortName: quote.shortName || quote.longName || quote.symbol,
      }));

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
