'use client';

import { useState } from 'react';
import TransactionFeedback from './TransactionFeedback';

export default function RemoveLiquidity() {
  const [lpTokenAmount, setLpTokenAmount] = useState('');
  const [transaction, setTransaction] = useState<{
    signature: string;
    status: 'success' | 'error';
    message: string;
  } | null>(null);

  const mockLpBalance = 125.5432;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mockSignature = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const proportion = parseFloat(lpTokenAmount) / mockLpBalance;
    const mockTokenAReceived = proportion * 1000;
    const mockTokenBReceived = proportion * 2000;
    const mockNewReserveA = 1000 - mockTokenAReceived;
    const mockNewReserveB = 2000 - mockTokenBReceived;

    setTransaction({
      signature: mockSignature,
      status: 'success',
      message: `Liquidity removed successfully!\n\nToken A Received: ${mockTokenAReceived.toFixed(4)}\nToken B Received: ${mockTokenBReceived.toFixed(4)}\n\nUpdated Reserve A: ${mockNewReserveA.toFixed(2)}\nUpdated Reserve B: ${mockNewReserveB.toFixed(2)}`,
    });

    setLpTokenAmount('');
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-white sm:mb-6 sm:text-2xl">Remove Liquidity</h2>

      <div className="mb-4 rounded-lg bg-slate-700/50 p-3 sm:mb-6 sm:p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-300 sm:text-sm">Your LP Token Balance</p>
          <p className="text-base font-bold text-white sm:text-lg">{mockLpBalance.toFixed(4)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-medium text-slate-300 sm:text-sm">
            LP Token Amount to Burn
          </label>
          <input
            type="number"
            value={lpTokenAmount}
            onChange={(e) => setLpTokenAmount(e.target.value)}
            placeholder="0.00"
            step="0.0001"
            min="0"
            max={mockLpBalance}
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4"
            required
          />
          <button
            type="button"
            onClick={() => setLpTokenAmount(mockLpBalance.toString())}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300 sm:text-sm"
          >
            Max
          </button>
        </div>

        {lpTokenAmount && (
          <div className="space-y-2 rounded-lg bg-slate-700/50 p-3 sm:p-4">
            <p className="text-xs font-medium text-slate-400 sm:text-sm">You will receive:</p>
            <div className="flex justify-between">
              <span className="text-xs text-slate-300 sm:text-sm">Token A</span>
              <span className="text-sm font-bold text-white sm:text-base">
                {((parseFloat(lpTokenAmount) / mockLpBalance) * 1000).toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-300 sm:text-sm">Token B</span>
              <span className="text-sm font-bold text-white sm:text-base">
                {((parseFloat(lpTokenAmount) / mockLpBalance) * 2000).toFixed(4)}
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 sm:py-3 sm:text-base"
        >
          Remove Liquidity
        </button>
      </form>

      {transaction && (
        <TransactionFeedback
          transaction={transaction}
          onClose={() => setTransaction(null)}
        />
      )}
    </div>
  );
}
