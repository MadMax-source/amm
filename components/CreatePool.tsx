'use client';

import { useState } from 'react';
import TransactionFeedback from './TransactionFeedback';

export default function CreatePool() {
  const [tokenAMint, setTokenAMint] = useState('');
  const [tokenBMint, setTokenBMint] = useState('');
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');
  const [fee, setFee] = useState('30');
  const [allowedSwapper, setAllowedSwapper] = useState('');
  const [transaction, setTransaction] = useState<{
    signature: string;
    status: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mockSignature = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const mockPoolPubkey = `POOL_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    setTransaction({
      signature: mockSignature,
      status: 'success',
      message: `Pool created successfully! Pool Public Key: ${mockPoolPubkey}`,
    });

    setTokenAMint('');
    setTokenBMint('');
    setTokenAAmount('');
    setTokenBAmount('');
    setFee('30');
    setAllowedSwapper('');
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-white sm:mb-6 sm:text-2xl">Create New Pool</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-medium text-slate-300 sm:text-sm">
            Token A Mint Address
          </label>
          <input
            type="text"
            value={tokenAMint}
            onChange={(e) => setTokenAMint(e.target.value)}
            placeholder="Enter Token A mint address"
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-300 sm:text-sm">
            Token B Mint Address
          </label>
          <input
            type="text"
            value={tokenBMint}
            onChange={(e) => setTokenBMint(e.target.value)}
            placeholder="Enter Token B mint address"
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-300 sm:text-sm">
            Fee (basis points)
          </label>
          <input
            type="number"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            placeholder="30"
            min="0"
            max="10000"
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4"
            required
          />
          <p className="mt-1 text-xs text-slate-400">
            {fee ? `${(parseInt(fee) / 100).toFixed(2)}%` : '0.00%'}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-300 sm:text-sm">
            Allowed Swapper Address
          </label>
          <input
            type="text"
            value={allowedSwapper}
            onChange={(e) => setAllowedSwapper(e.target.value)}
            placeholder="Enter allowed swapper public key"
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:py-3 sm:text-base"
        >
          Create Pool
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
