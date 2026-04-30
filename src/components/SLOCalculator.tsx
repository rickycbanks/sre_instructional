'use client';

import React, { useState, useMemo } from 'react';

export default function SLOCalculator() {
  const [totalRequests, setTotalRequests] = useState(1000000);
  const [targetSLO, setTargetSLO] = useState(99.9);
  const [errorRate, setErrorRate] = useState(0.05);

  const stats = useMemo(() => {
    const targetFraction = targetSLO / 100;
    const allowedErrors = Math.floor(totalRequests * (1 - targetFraction));
    const actualErrors = Math.floor(totalRequests * (errorRate / 100));
    const remainingBudget = allowedErrors - actualErrors;
    const budgetPercentage = (remainingBudget / allowedErrors) * 100;

    return {
      allowedErrors,
      actualErrors,
      remainingBudget,
      budgetPercentage,
      isExhausted: remainingBudget < 0,
    };
  }, [totalRequests, targetSLO, errorRate]);

  return (
    <div className="my-8 p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm not-prose">
      <h3 className="text-xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Interactive Error Budget Calculator</h3>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div>
          <label className="block text-sm font-medium text-zinc-500 mb-2">Total Requests (per month)</label>
          <input 
            type="number" 
            value={totalRequests} 
            onChange={(e) => setTotalRequests(Number(e.target.value))}
            className="w-full bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 text-zinc-900 dark:text-zinc-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-500 mb-2">Target SLO (%)</label>
          <input 
            type="number" 
            step="0.01"
            value={targetSLO} 
            onChange={(e) => setTargetSLO(Number(e.target.value))}
            className="w-full bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 text-zinc-900 dark:text-zinc-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-500 mb-2">Current Error Rate (%)</label>
          <input 
            type="number" 
            step="0.01"
            value={errorRate} 
            onChange={(e) => setErrorRate(Number(e.target.value))}
            className="w-full bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 text-zinc-900 dark:text-zinc-50"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-bold">Allowed Errors</div>
          <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-zinc-50">{stats.allowedErrors.toLocaleString()}</div>
        </div>
        <div className="p-4 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-bold">Actual Errors</div>
          <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-zinc-50">{stats.actualErrors.toLocaleString()}</div>
        </div>
        <div className={`p-4 border rounded-xl ${stats.isExhausted ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900' : 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900'}`}>
          <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-bold">Remaining Budget</div>
          <div className={`text-2xl font-mono font-bold ${stats.isExhausted ? 'text-red-600' : 'text-green-600'}`}>
            {stats.remainingBudget.toLocaleString()}
          </div>
        </div>
        <div className={`p-4 border rounded-xl ${stats.isExhausted ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900' : 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900'}`}>
          <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-bold">Budget Status</div>
          <div className={`text-2xl font-mono font-bold ${stats.isExhausted ? 'text-red-600' : 'text-blue-600'}`}>
            {stats.budgetPercentage.toFixed(1)}%
          </div>
        </div>
      </div>

      {stats.isExhausted && (
        <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg text-sm font-medium border border-red-200 dark:border-red-800">
          ⚠️ <strong>Error Budget Exhausted!</strong> Per SRE policy, feature releases should be frozen until reliability is restored.
        </div>
      )}
    </div>
  );
}
