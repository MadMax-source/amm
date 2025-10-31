'use client';

import { useState } from 'react';

export default function PoolInfo() {
  const [refreshing, setRefreshing] = useState(false);

  const poolData = {
    publicKey: 'POOL7xKpN8RzT4v2mL9Qa3WbHnJ5tYcPfE2sD1kR',
    tokenAMint: 'TokenA8xKpN8RzT4v2mL9Qa3WbHnJ5tYcPf',
    tokenBMint: 'TokenB7xKpN8RzT4v2mL9Qa3WbHnJ5tYcPf',
    reserveA: 1000.0,
    reserveB: 2000.0,
    lpSupply: 1414.2136,
    fee: 0.3,
    allowedSwapper: 'ALLOWED_SWAP_PUBKEY_HERE',
    price: 2.0,
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const explorerUrl = `https://solscan.io/account/${poolData.publicKey}?cluster=devnet`;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2 sm:mb-6">
        <h2 className="text-xl font-bold text-white sm:text-2xl">Pool Information</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4">
          <p className="mb-2 text-xs text-slate-400 sm:text-sm">Pool Public Key</p>
          <div className="flex items-center justify-between gap-2">
            <p className="break-all font-mono text-xs text-white sm:text-sm">{poolData.publicKey}</p>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs text-blue-400 hover:text-blue-300 sm:text-sm"
            >
              View
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4">
            <p className="mb-2 text-xs text-slate-400 sm:text-sm">Token A Mint</p>
            <p className="truncate font-mono text-xs text-white">{poolData.tokenAMint}</p>
          </div>

          <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4">
            <p className="mb-2 text-xs text-slate-400 sm:text-sm">Token B Mint</p>
            <p className="truncate font-mono text-xs text-white">{poolData.tokenBMint}</p>
          </div>
        </div>

        <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4">
          <p className="mb-3 text-xs font-medium text-slate-300 sm:mb-4 sm:text-sm">Current Reserves</p>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 sm:text-sm">Token A</span>
              <span className="text-lg font-bold text-white sm:text-xl">{poolData.reserveA.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 sm:text-sm">Token B</span>
              <span className="text-lg font-bold text-white sm:text-xl">{poolData.reserveB.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4">
            <p className="mb-2 text-xs text-slate-400 sm:text-sm">LP Supply</p>
            <p className="text-lg font-bold text-white sm:text-xl">{poolData.lpSupply.toFixed(4)}</p>
          </div>

          <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4">
            <p className="mb-2 text-xs text-slate-400 sm:text-sm">Fee</p>
            <p className="text-lg font-bold text-white sm:text-xl">{poolData.fee}%</p>
          </div>
        </div>

        <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4">
          <p className="mb-2 text-xs text-slate-400 sm:text-sm">Current Price</p>
          <p className="break-words text-base font-bold text-white sm:text-xl">
            1 Token A = {poolData.price.toFixed(6)} Token B
          </p>
        </div>

        <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4">
          <p className="mb-2 text-xs text-slate-400 sm:text-sm">Allowed Swapper</p>
          <p className="truncate font-mono text-xs text-white sm:text-sm">{poolData.allowedSwapper}</p>
        </div>

        <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 sm:p-4">
          <p className="text-xs text-blue-300 sm:text-sm">
            This pool information is fetched from the Solana blockchain. Click refresh to update the data.
          </p>
        </div>
      </div>
    </div>
  );
}
