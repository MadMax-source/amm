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
      <h2 className="mb-6 text-2xl font-bold text-white">Swap Tokens</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg bg-slate-700/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">From</label>
            <span className="text-sm text-slate-400">
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
            className="w-full rounded-lg bg-slate-700 px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSwapDirection}
            className="rounded-full bg-slate-700 p-2 transition-transform hover:scale-110 hover:bg-slate-600"
          >
            <svg
              className="h-6 w-6 text-white"
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

        <div className="rounded-lg bg-slate-700/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">To (estimated)</label>
            <span className="text-sm text-slate-400">
              {direction === 'AtoB' ? 'Token B' : 'Token A'}
            </span>
          </div>
          <input
            type="text"
            value={estimatedOutput.toFixed(4)}
            readOnly
            className="w-full rounded-lg bg-slate-700 px-4 py-2 text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Minimum Output (Slippage Protection)
          </label>
          <input
            type="number"
            value={minOutput}
            onChange={(e) => setMinOutput(e.target.value)}
            placeholder="0.00"
            step="0.0001"
            min="0"
            className="w-full rounded-lg bg-slate-700 px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setMinOutput((estimatedOutput * 0.99).toFixed(4))}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300"
          >
            Set 1% slippage
          </button>
        </div>

        <div className="rounded-lg bg-slate-700/50 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Current Price</span>
            <span className="text-white">
              1 {direction === 'AtoB' ? 'A' : 'B'} = {currentPrice.toFixed(6)} {direction === 'AtoB' ? 'B' : 'A'}
            </span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-slate-400">Fee</span>
            <span className="text-white">{(fee * 100).toFixed(2)}%</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700"
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
