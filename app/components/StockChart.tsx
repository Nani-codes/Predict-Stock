'use client';

import { createChart, ColorType } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { Card } from '@tremor/react';

interface StockChartProps {
  data: {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
}

interface CandlestickData {
  close: number;
  open: number;
  high: number;
  low: number;
  time: string;
}

const StockChart = ({ data }: StockChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredData, setHoveredData] = useState<{
    price: number;
    time: string;
  } | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data?.length) return;

    // Validate data
    const validData = data.filter(item => 
      item &&
      typeof item.time === 'string' &&
      typeof item.open === 'number' && !isNaN(item.open) &&
      typeof item.high === 'number' && !isNaN(item.high) &&
      typeof item.low === 'number' && !isNaN(item.low) &&
      typeof item.close === 'number' && !isNaN(item.close)
    );

    if (!validData.length) {
      console.error('No valid data for chart');
      return;
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1E293B' },
        textColor: '#D1D5DB',
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      grid: {
        vertLines: { color: '#334155' },
        horzLines: { color: '#334155' },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          width: 1,
          color: '#64748B',
          style: 3,
        },
        horzLine: {
          width: 1,
          color: '#64748B',
          style: 3,
        },
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22C55E',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#22C55E',
      wickDownColor: '#EF4444',
    });

    try {
      candlestickSeries.setData(validData);
    } catch (error) {
      console.error('Error setting chart data:', error);
      return;
    }

    // Add price scale
    chart.priceScale('right').applyOptions({
      borderColor: '#334155',
      scaleMargins: {
        top: 0.2,
        bottom: 0.2,
      },
    });

    // Add time scale
    chart.timeScale().applyOptions({
      borderColor: '#334155',
      timeVisible: true,
      secondsVisible: false,
    });

    // Add hover effect
    chart.subscribeCrosshairMove((param) => {
      if (
        param.time &&
        param.point &&
        param.seriesData.get(candlestickSeries) &&
        chartContainerRef.current
      ) {
        const data = param.seriesData.get(candlestickSeries) as CandlestickData;
        setHoveredData({
          price: data.close,
          time: param.time as string,
        });
      } else {
        setHoveredData(null);
      }
    });

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  if (!data?.length) {
    return (
      <Card className="bg-slate-800 p-4">
        <div className="h-[500px] flex items-center justify-center text-gray-400">
          No data available for chart
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 p-4">
      <div className="relative">
        {hoveredData && (
          <div className="absolute top-2 left-2 bg-slate-700 px-3 py-1 rounded-md text-sm text-white">
            {hoveredData.time} | ${hoveredData.price.toFixed(2)}
          </div>
        )}
        <div ref={chartContainerRef} className="w-full h-[500px]" />
      </div>
    </Card>
  );
};

export default StockChart;
