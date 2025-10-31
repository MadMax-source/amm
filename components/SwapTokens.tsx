'use client';

import { useState, useEffect } from 'react';
import TransactionFeedback from './TransactionFeedback';

export default function SwapTokens() {
  const [direction, setDirection] = useState<'AtoB' | 'BtoA'>('AtoB');
  const [tokenAAddress, setTokenAAddress] = useState('');
  const [tokenBAddress, setTokenBAddress] = useState('');
  const [tokenAInfo, setTokenAInfo] = useState<{
    name: string;
    symbol: string;
    price: number;
  } | null>(null);
  const [tokenBInfo, setTokenBInfo] = useState<{
    name: string;
    symbol: string;
    price: number;
  } | null>(null);
  const [amountA, setAmountA] = useState('');
  const [estimatedOutput, setEstimatedOutput] = useState(0);
  const [transaction, setTransaction] = useState<{
    signature: string;
    status: 'success' | 'error';
    message: string;
  } | null>(null);

  // Mock token info fetch (you can replace with real API later)
  const mockFetchTokenInfo = async (address: string) => {
    if (!address) return null;
    const symbols = ['SOL', 'USDC', 'BONK', 'SRM', 'RAY'];
    const names = ['Solana', 'USD Coin', 'Bonk', 'Serum', 'Raydium'];
    const idx = Math.floor(Math.random() * symbols.length);
    return {
      name: names[idx],
      symbol: symbols[idx],
      price: parseFloat((Math.random() * 100).toFixed(2)),
    };
  };

  // Handle address entry — fetch mock token info
  useEffect(() => {
    const fetchTokens = async () => {
      if (tokenAAddress) {
        const info = await mockFetchTokenInfo(tokenAAddress);
        setTokenAInfo(info);
      } else setTokenAInfo(null);
      if (tokenBAddress) {
        const info = await mockFetchTokenInfo(tokenBAddress);
        setTokenBInfo(info);
      } else setTokenBInfo(null);
    };
    fetchTokens();
  }, [tokenAAddress, tokenBAddress]);

  // Estimate output dynamically (mock formula)
  useEffect(() => {
    if (amountA && tokenAInfo && tokenBInfo) {
      const output = (parseFloat(amountA) * tokenAInfo.price) / tokenBInfo.price;
      setEstimatedOutput(output);
    } else {
      setEstimatedOutput(0);
    }
  }, [amountA, tokenAInfo, tokenBInfo]);

  // Swap direction logic
  const handleSwapDirection = () => {
    setDirection(direction === 'AtoB' ? 'BtoA' : 'AtoB');
    // Swap token states
    const tempAddress = tokenAAddress;
    const tempInfo = tokenAInfo;
    setTokenAAddress(tokenBAddress);
    setTokenAInfo(tokenBInfo);
    setTokenBAddress(tempAddress);
    setTokenBInfo(tempInfo);
    setAmountA('');
    setEstimatedOutput(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockSignature = Math.random().toString(36).substring(2, 15);
    setTransaction({
      signature: mockSignature,
      status: 'success',
      message: `Swap Successful!\n\nYou swapped ${amountA} ${
        tokenAInfo?.symbol
      } for approximately ${estimatedOutput.toFixed(4)} ${tokenBInfo?.symbol}.`,
    });
    setAmountA('');
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-white sm:mb-6 sm:text-2xl">Swap Tokens</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Token A Input */}
        <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4">
          <label className="mb-2 block text-xs font-medium text-slate-300 sm:text-sm">
            {direction === 'AtoB' ? 'Token A Address' : 'Token B Address'}
          </label>
          <input
            type="text"
            value={tokenAAddress}
            onChange={(e) => setTokenAAddress(e.target.value)}
            placeholder="Enter token address..."
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4"
          />
          {tokenAInfo && (
            <div className="mt-2 text-xs text-slate-300 sm:text-sm">
              <p>
                <strong>{tokenAInfo.name}</strong> ({tokenAInfo.symbol})
              </p>
              <p className="text-slate-400">Price: ${tokenAInfo.price}</p>
            </div>
          )}
        </div>

        {/* Swap direction */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSwapDirection}
            className="rounded-full bg-slate-700 p-2 transition-transform hover:scale-110 hover:bg-slate-600 sm:p-2.5"
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

        {/* Token B Input */}
        <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4">
          <label className="mb-2 block text-xs font-medium text-slate-300 sm:text-sm">
            {direction === 'AtoB' ? 'Token B Address' : 'Token A Address'}
          </label>
          <input
            type="text"
            value={tokenBAddress}
            onChange={(e) => setTokenBAddress(e.target.value)}
            placeholder="Enter token address..."
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4"
          />
          {tokenBInfo && (
            <div className="mt-2 text-xs text-slate-300 sm:text-sm">
              <p>
                <strong>{tokenBInfo.name}</strong> ({tokenBInfo.symbol})
              </p>
              <p className="text-slate-400">Price: ${tokenBInfo.price}</p>
            </div>
          )}
        </div>

        {/* Amount + Estimation */}
        <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4 space-y-2">
          <label className="block text-xs font-medium text-slate-300 sm:text-sm">
            Amount to Swap ({tokenAInfo?.symbol || 'Token A'})
          </label>
          <input
            type="number"
            value={amountA}
            onChange={(e) => setAmountA(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4"
          />
          {estimatedOutput > 0 && (
            <p className="text-xs text-slate-400 sm:text-sm">
              ≈ {estimatedOutput.toFixed(4)} {tokenBInfo?.symbol || 'Token B'}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!tokenAInfo || !tokenBInfo || !amountA}
          className={`w-full rounded-lg py-2.5 text-sm font-medium text-white sm:py-3 sm:text-base transition-colors ${
            !tokenAInfo || !tokenBInfo || !amountA
              ? 'bg-slate-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Swap
        </button>
      </form>

      {transaction && (
        <TransactionFeedback transaction={transaction} onClose={() => setTransaction(null)} />
      )}
    </div>
  );
}

/*


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


*/
