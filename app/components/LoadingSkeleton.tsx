'use client';

import { Card } from '@tremor/react';

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <Card className="bg-slate-800 border-gray-700">
        <div className="h-24 bg-slate-700 rounded-lg"></div>
      </Card>

      <Card className="bg-slate-800 border-gray-700">
        <div className="space-y-4">
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="bg-slate-800 border-gray-700">
        <div className="space-y-4">
          <div className="h-4 bg-slate-700 rounded w-1/3"></div>
          <div className="h-[400px] bg-slate-700 rounded"></div>
        </div>
      </Card>
    </div>
  );
}

export default LoadingSkeleton;
