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
      <h2 className="mb-6 text-2xl font-bold text-white">Remove Liquidity</h2>

      <div className="mb-6 rounded-lg bg-slate-700/50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-300">Your LP Token Balance</p>
          <p className="text-lg font-bold text-white">{mockLpBalance.toFixed(4)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
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
            className="w-full rounded-lg bg-slate-700 px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setLpTokenAmount(mockLpBalance.toString())}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300"
          >
            Max
          </button>
        </div>

        {lpTokenAmount && (
          <div className="space-y-2 rounded-lg bg-slate-700/50 p-4">
            <p className="text-sm font-medium text-slate-400">You will receive:</p>
            <div className="flex justify-between">
              <span className="text-sm text-slate-300">Token A</span>
              <span className="font-bold text-white">
                {((parseFloat(lpTokenAmount) / mockLpBalance) * 1000).toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-300">Token B</span>
              <span className="font-bold text-white">
                {((parseFloat(lpTokenAmount) / mockLpBalance) * 2000).toFixed(4)}
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-red-600 py-3 font-medium text-white transition-colors hover:bg-red-700"
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
