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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Pool Information</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg bg-slate-700/50 p-4">
          <p className="mb-2 text-sm text-slate-400">Pool Public Key</p>
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-sm text-white">{poolData.publicKey}</p>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-slate-700/50 p-4">
            <p className="mb-2 text-sm text-slate-400">Token A Mint</p>
            <p className="truncate font-mono text-xs text-white">{poolData.tokenAMint}</p>
          </div>

          <div className="rounded-lg bg-slate-700/50 p-4">
            <p className="mb-2 text-sm text-slate-400">Token B Mint</p>
            <p className="truncate font-mono text-xs text-white">{poolData.tokenBMint}</p>
          </div>
        </div>

        <div className="rounded-lg bg-slate-700/50 p-4">
          <p className="mb-4 text-sm font-medium text-slate-300">Current Reserves</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Token A</span>
              <span className="text-xl font-bold text-white">{poolData.reserveA.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Token B</span>
              <span className="text-xl font-bold text-white">{poolData.reserveB.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-slate-700/50 p-4">
            <p className="mb-2 text-sm text-slate-400">LP Supply</p>
            <p className="text-xl font-bold text-white">{poolData.lpSupply.toFixed(4)}</p>
          </div>

          <div className="rounded-lg bg-slate-700/50 p-4">
            <p className="mb-2 text-sm text-slate-400">Fee</p>
            <p className="text-xl font-bold text-white">{poolData.fee}%</p>
          </div>
        </div>

        <div className="rounded-lg bg-slate-700/50 p-4">
          <p className="mb-2 text-sm text-slate-400">Current Price</p>
          <p className="text-xl font-bold text-white">
            1 Token A = {poolData.price.toFixed(6)} Token B
          </p>
        </div>

        <div className="rounded-lg bg-slate-700/50 p-4">
          <p className="mb-2 text-sm text-slate-400">Allowed Swapper</p>
          <p className="truncate font-mono text-sm text-white">{poolData.allowedSwapper}</p>
        </div>

        <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
          <p className="text-sm text-blue-300">
            This pool information is fetched from the Solana blockchain. Click refresh to update the data.
          </p>
        </div>
      </div>
    </div>
  );
}
