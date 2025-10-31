'use client';

import { useState, useEffect } from 'react';
import TransactionFeedback from './TransactionFeedback';

interface TokenInfo {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  usdPrice?: number;
}

export default function SwapTokens() {
  const [direction, setDirection] = useState<'AtoB' | 'BtoA'>('AtoB');
  const [tokenA, setTokenA] = useState<TokenInfo | null>(null);
  const [tokenB, setTokenB] = useState<TokenInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<TokenInfo[]>([]);
  const [isSearchingFor, setIsSearchingFor] = useState<'A' | 'B' | null>(null);
  const [amountA, setAmountA] = useState('');
  const [estimatedOutput, setEstimatedOutput] = useState(0);
  const [transaction, setTransaction] = useState<{
    signature: string;
    status: 'success' | 'error';
    message: string;
  } | null>(null);

  // 🔎 Search tokens from Jupiter API
  useEffect(() => {
    const fetchTokens = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetch(
          `https://lite-api.jup.ag/ultra/v1/search?query=${encodeURIComponent(searchTerm)}`,
        );
        const data = await res.json();
        const tokens = Array.isArray(data)
          ? data.map((t: any) => ({
              id: t.id,
              name: t.name,
              symbol: t.symbol,
              icon: t.icon,
              usdPrice: t.usdPrice,
            }))
          : [];
        setSearchResults(tokens);
      } catch (err) {
        console.error('Error fetching tokens:', err);
        setSearchResults([]);
      }
    };

    const timeout = setTimeout(fetchTokens, 400); // debounce
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // 💰 Estimate output
  useEffect(() => {
    if (amountA && tokenA?.usdPrice && tokenB?.usdPrice) {
      const output = (parseFloat(amountA) * tokenA.usdPrice) / tokenB.usdPrice;
      setEstimatedOutput(output);
    } else {
      setEstimatedOutput(0);
    }
  }, [amountA, tokenA, tokenB]);

  // 🔄 Swap direction and token states
  const handleSwapDirection = () => {
    setDirection(direction === 'AtoB' ? 'BtoA' : 'AtoB');
    const temp = tokenA;
    setTokenA(tokenB);
    setTokenB(temp);
    setAmountA('');
    setEstimatedOutput(0);
  };

  const handleSelectToken = (token: TokenInfo) => {
    if (isSearchingFor === 'A') setTokenA(token);
    else if (isSearchingFor === 'B') setTokenB(token);
    setSearchResults([]);
    setSearchTerm('');
    setIsSearchingFor(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockSig = Math.random().toString(36).substring(2, 15);
    setTransaction({
      signature: mockSig,
      status: 'success',
      message: `Swap Successful!\n\nYou swapped ${amountA} ${
        tokenA?.symbol
      } for approximately ${estimatedOutput.toFixed(4)} ${tokenB?.symbol}.`,
    });
    setAmountA('');
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-white sm:mb-6 sm:text-2xl">Swap Tokens</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* TOKEN A SELECT */}
        <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4 relative">
          <label className="mb-2 block text-xs font-medium text-slate-300 sm:text-sm">
            {direction === 'AtoB' ? 'From Token' : 'To Token'}
          </label>

          {tokenA ? (
            <div
              className="flex items-center justify-between rounded-lg bg-slate-800 p-2 cursor-pointer hover:bg-slate-700"
              onClick={() => {
                setIsSearchingFor('A');
                setSearchTerm('');
              }}
            >
              <div className="flex items-center space-x-3">
                <img src={tokenA.icon} alt={tokenA.symbol} className="h-6 w-6 rounded-full" />
                <div>
                  <p className="text-white text-sm font-medium">{tokenA.name}</p>
                  <p className="text-xs text-slate-400">
                    {tokenA.symbol} • {tokenA.id.slice(0, 4)}...{tokenA.id.slice(-4)}
                  </p>
                </div>
              </div>
              <span className="text-slate-400 text-xs">${tokenA.usdPrice?.toFixed(3)}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsSearchingFor('A');
                setSearchTerm('');
              }}
              className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Select Token A
            </button>
          )}
        </div>

        {/* SWAP DIRECTION BUTTON */}
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

        {/* TOKEN B SELECT */}
        <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4 relative">
          <label className="mb-2 block text-xs font-medium text-slate-300 sm:text-sm">
            {direction === 'AtoB' ? 'To Token' : 'From Token'}
          </label>

          {tokenB ? (
            <div
              className="flex items-center justify-between rounded-lg bg-slate-800 p-2 cursor-pointer hover:bg-slate-700"
              onClick={() => {
                setIsSearchingFor('B');
                setSearchTerm('');
              }}
            >
              <div className="flex items-center space-x-3">
                <img src={tokenB.icon} alt={tokenB.symbol} className="h-6 w-6 rounded-full" />
                <div>
                  <p className="text-white text-sm font-medium">{tokenB.name}</p>
                  <p className="text-xs text-slate-400">
                    {tokenB.symbol} • {tokenB.id.slice(0, 4)}...{tokenB.id.slice(-4)}
                  </p>
                </div>
              </div>
              <span className="text-slate-400 text-xs">${tokenB.usdPrice?.toFixed(3)}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsSearchingFor('B');
                setSearchTerm('');
              }}
              className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Select Token B
            </button>
          )}
        </div>

        {/* AMOUNT INPUT */}
        <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4 space-y-2">
          <label className="block text-xs font-medium text-slate-300 sm:text-sm">
            Amount to Swap ({tokenA?.symbol || 'Token A'})
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
              ≈ {estimatedOutput.toFixed(4)} {tokenB?.symbol || 'Token B'}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!tokenA || !tokenB || !amountA}
          className={`w-full rounded-lg py-2.5 text-sm font-medium text-white sm:py-3 sm:text-base transition-colors ${
            !tokenA || !tokenB || !amountA
              ? 'bg-slate-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Swap
        </button>
      </form>

      {/* SEARCH DROPDOWN */}
      {isSearchingFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-800 w-11/12 max-w-md rounded-xl p-4">
            <h3 className="text-white text-lg font-semibold mb-3">Search Token {isSearchingFor}</h3>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, symbol, or address..."
              className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-3 max-h-64 overflow-y-auto">
              {searchResults.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-3">
                  {searchTerm ? 'Searching...' : 'Type to search tokens'}
                </p>
              ) : (
                searchResults.map((token) => (
                  <div
                    key={token.id}
                    onClick={() => handleSelectToken(token)}
                    className="flex items-center justify-between p-2 hover:bg-slate-700 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={token.icon} alt={token.symbol} className="h-6 w-6 rounded-full" />
                      <div>
                        <p className="text-white text-sm font-medium">{token.name}</p>
                        <p className="text-xs text-slate-400">
                          {token.symbol} • {token.id.slice(0, 4)}...{token.id.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <span className="text-slate-400 text-xs">
                      ${token.usdPrice?.toFixed(3) || '-'}
                    </span>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setIsSearchingFor(null)}
              className="mt-4 w-full rounded-lg bg-slate-700 py-2 text-sm font-medium text-white hover:bg-slate-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {transaction && (
        <TransactionFeedback transaction={transaction} onClose={() => setTransaction(null)} />
      )}
    </div>
  );
}

/*


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


*/
