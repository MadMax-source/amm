'use client';

import { useState } from 'react';
import TransactionFeedback from './TransactionFeedback';

export default function AddLiquidity() {
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');
  const [transaction, setTransaction] = useState<{
    signature: string;
    status: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mockSignature = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const mockLpTokens = (parseFloat(tokenAAmount) * parseFloat(tokenBAmount)) ** 0.5;
    const mockReserveA = 1000 + parseFloat(tokenAAmount);
    const mockReserveB = 2000 + parseFloat(tokenBAmount);

    setTransaction({
      signature: mockSignature,
      status: 'success',
      message: `Liquidity added successfully!\n\nLP Tokens Received: ${mockLpTokens.toFixed(4)}\nUpdated Reserve A: ${mockReserveA.toFixed(2)}\nUpdated Reserve B: ${mockReserveB.toFixed(2)}`,
    });

    setTokenAAmount('');
    setTokenBAmount('');
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-white sm:mb-6 sm:text-2xl">Add Liquidity</h2>

      <div className="mb-4 rounded-lg bg-slate-700/50 p-3 sm:mb-6 sm:p-4">
        <p className="text-xs text-slate-300 sm:text-sm">
          Provide liquidity to earn trading fees. You will receive LP tokens representing your share of the pool.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-medium text-slate-300 sm:text-sm">
            Token A Amount
          </label>
          <input
            type="number"
            value={tokenAAmount}
            onChange={(e) => setTokenAAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-300 sm:text-sm">
            Token B Amount
          </label>
          <input
            type="number"
            value={tokenBAmount}
            onChange={(e) => setTokenBAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4"
            required
          />
        </div>

        {tokenAAmount && tokenBAmount && (
          <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4">
            <p className="text-xs text-slate-400 sm:text-sm">Estimated LP Tokens</p>
            <p className="text-xl font-bold text-white sm:text-2xl">
              {((parseFloat(tokenAAmount) * parseFloat(tokenBAmount)) ** 0.5).toFixed(4)}
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 sm:py-3 sm:text-base"
        >
          Add Liquidity
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
