'use client';

import { useState } from 'react';
import TransactionFeedback from './TransactionFeedback';

export default function SwapTokens() {
  const [direction, setDirection] = useState<'AtoB' | 'BtoA'>('AtoB');
  const [inputAmount, setInputAmount] = useState('');
  const [minOutput, setMinOutput] = useState('');
  const [transaction, setTransaction] = useState<{
    signature: string;
    status: 'success' | 'error';
    message: string;
  } | null>(null);

  const mockReserveA = 1000;
  const mockReserveB = 2000;
  const fee = 0.003;

  const calculateOutput = (input: number): number => {
    if (direction === 'AtoB') {
      const inputWithFee = input * (1 - fee);
      return (mockReserveB * inputWithFee) / (mockReserveA + inputWithFee);
    } else {
      const inputWithFee = input * (1 - fee);
      return (mockReserveA * inputWithFee) / (mockReserveB + inputWithFee);
    }
  };

  const estimatedOutput = inputAmount ? calculateOutput(parseFloat(inputAmount)) : 0;
  const currentPrice = direction === 'AtoB'
    ? mockReserveB / mockReserveA
    : mockReserveA / mockReserveB;

  const handleSwapDirection = () => {
    setDirection(direction === 'AtoB' ? 'BtoA' : 'AtoB');
    setInputAmount('');
    setMinOutput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const output = calculateOutput(parseFloat(inputAmount));
    const minOutputNum = parseFloat(minOutput);

    if (output < minOutputNum) {
      setTransaction({
        signature: '',
        status: 'error',
        message: `Slippage exceeded! Expected minimum ${minOutputNum.toFixed(4)} but would receive ${output.toFixed(4)}`,
      });
      return;
    }

    const mockSignature = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const newReserveA = direction === 'AtoB'
      ? mockReserveA + parseFloat(inputAmount)
      : mockReserveA - output;
    const newReserveB = direction === 'AtoB'
      ? mockReserveB - output
      : mockReserveB + parseFloat(inputAmount);
    const newPrice = direction === 'AtoB'
      ? newReserveB / newReserveA
      : newReserveA / newReserveB;

    setTransaction({
      signature: mockSignature,
      status: 'success',
      message: `Swap successful!\n\nAmount Received: ${output.toFixed(4)} ${direction === 'AtoB' ? 'Token B' : 'Token A'}\n\nUpdated Reserves:\nToken A: ${newReserveA.toFixed(2)}\nToken B: ${newReserveB.toFixed(2)}\n\nNew Price: ${newPrice.toFixed(6)}`,
    });

    setInputAmount('');
    setMinOutput('');
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-white sm:mb-6 sm:text-2xl">Swap Tokens</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 sm:text-sm">From</label>
            <span className="text-xs text-slate-400 sm:text-sm">
              {direction === 'AtoB' ? 'Token A' : 'Token B'}
            </span>
          </div>
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4"
            required
          />
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSwapDirection}
            className="rounded-full bg-slate-700 p-1.5 transition-transform hover:scale-110 hover:bg-slate-600 sm:p-2"
          >
            <svg
              className="h-5 w-5 text-white sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </button>
        </div>

        <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 sm:text-sm">To (estimated)</label>
            <span className="text-xs text-slate-400 sm:text-sm">
              {direction === 'AtoB' ? 'Token B' : 'Token A'}
            </span>
          </div>
          <input
            type="text"
            value={estimatedOutput.toFixed(4)}
            readOnly
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white sm:px-4"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-300 sm:text-sm">
            Minimum Output (Slippage Protection)
          </label>
          <input
            type="number"
            value={minOutput}
            onChange={(e) => setMinOutput(e.target.value)}
            placeholder="0.00"
            step="0.0001"
            min="0"
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4"
            required
          />
          <button
            type="button"
            onClick={() => setMinOutput((estimatedOutput * 0.99).toFixed(4))}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300 sm:text-sm"
          >
            Set 1% slippage
          </button>
        </div>

        <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-slate-400">Current Price</span>
            <span className="break-all text-right text-white">
              1 {direction === 'AtoB' ? 'A' : 'B'} = {currentPrice.toFixed(6)} {direction === 'AtoB' ? 'B' : 'A'}
            </span>
          </div>
          <div className="mt-2 flex justify-between text-xs sm:text-sm">
            <span className="text-slate-400">Fee</span>
            <span className="text-white">{(fee * 100).toFixed(2)}%</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:py-3 sm:text-base"
        >
          Swap
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
