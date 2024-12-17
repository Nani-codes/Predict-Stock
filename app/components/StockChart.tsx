'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import { Card, Title } from '@tremor/react';

interface ChartData {
  time: string;
  value: number;
}

interface StockChartProps {
  data: ChartData[];
  symbol: string;
  companyName?: string;
}

export default function StockChart({ data, symbol, companyName }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !Array.isArray(data) || data.length === 0) {
      return;
    }

    // Validate data
    const validData = data.filter(item => (
      item &&
      typeof item.time === 'string' &&
      typeof item.value === 'number' &&
      !isNaN(item.value)
    ));

    if (validData.length === 0) {
      console.error('No valid data for chart');
      return;
    }

    // Create new chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#334155' },
        horzLines: { color: '#334155' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    // Create and configure the area series
    const newSeries = chart.addAreaSeries({
      lineColor: '#3b82f6',
      topColor: 'rgba(59, 130, 246, 0.4)',
      bottomColor: 'rgba(59, 130, 246, 0)',
      lineWidth: 2,
    });

    // Set up resize observer
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0].contentRect) {
        chart.applyOptions({
          width: entries[0].contentRect.width,
        });
      }
    });

    resizeObserver.observe(chartContainerRef.current);
    resizeObserverRef.current = resizeObserver;

    try {
      newSeries.setData(validData);
      chart.timeScale().fitContent();
    } catch (error) {
      console.error('Error setting chart data:', error);
    }

    chartRef.current = chart;

    // Cleanup function
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data]);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card className="mt-6 bg-slate-800 border-gray-700">
        <Title className="text-white mb-4">
          {companyName || symbol} Stock Price History
        </Title>
        <div className="h-[400px] flex items-center justify-center text-gray-400">
          No historical data available
        </div>
      </Card>
    );
  }

  return (
    <Card className="mt-6 bg-slate-800 border-gray-700">
      <Title className="text-white mb-4">
        {companyName || symbol} Stock Price History
      </Title>
      <div ref={chartContainerRef} className="w-full" />
    </Card>
  );
}
