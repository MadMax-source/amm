'use client';

import { useState } from 'react';
import WalletConnect from '@/components/WalletConnect';
import CreatePool from '@/components/CreatePool';
import AddLiquidity from '@/components/AddLiquidity';
import RemoveLiquidity from '@/components/RemoveLiquidity';
import SwapTokens from '@/components/SwapTokens';
import PoolInfo from '@/components/PoolInfo';

export default function Home() {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [allowedSwapper] = useState<string>('ALLOWED_SWAP_PUBKEY_HERE');
  const [activeTab, setActiveTab] = useState<'create' | 'add' | 'remove' | 'swap' | 'info'>('create');

  const isAllowedSwapper = connectedWallet === allowedSwapper;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Solana AMM</h1>
            <WalletConnect
              connectedWallet={connectedWallet}
              onConnect={setConnectedWallet}
            />
          </div>
        </header>

        {!connectedWallet ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mb-6 text-6xl">🔌</div>
              <h2 className="mb-2 text-2xl font-semibold text-white">Connect Your Wallet</h2>
              <p className="text-slate-400">Please connect your Solana wallet to continue</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6 flex gap-2 overflow-x-auto rounded-lg bg-slate-800/50 p-2">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'create'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Create Pool
                </button>
                <button
                  onClick={() => setActiveTab('add')}
                  className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'add'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Add Liquidity
                </button>
                <button
                  onClick={() => setActiveTab('remove')}
                  className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'remove'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Remove Liquidity
                </button>
                <button
                  onClick={() => setActiveTab('swap')}
                  disabled={!isAllowedSwapper}
                  className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'swap' && isAllowedSwapper
                      ? 'bg-blue-600 text-white'
                      : !isAllowedSwapper
                      ? 'cursor-not-allowed text-slate-500'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                  title={!isAllowedSwapper ? 'Only allowed swapper can access' : ''}
                >
                  Swap {!isAllowedSwapper && '🔒'}
                </button>
                <button
                  onClick={() => setActiveTab('info')}
                  className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'info'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Pool Info
                </button>
              </div>

              <div className="rounded-lg bg-slate-800/50 p-6 backdrop-blur-sm">
                {activeTab === 'create' && <CreatePool />}
                {activeTab === 'add' && <AddLiquidity />}
                {activeTab === 'remove' && <RemoveLiquidity />}
                {activeTab === 'swap' && (
                  isAllowedSwapper ? (
                    <SwapTokens />
                  ) : (
                    <div className="py-12 text-center">
                      <div className="mb-4 text-5xl">❌</div>
                      <h3 className="mb-2 text-xl font-semibold text-white">Unauthorized</h3>
                      <p className="text-slate-400">You are not the allowed swapper.</p>
                      <p className="mt-2 text-sm text-slate-500">
                        Connected: {connectedWallet?.slice(0, 8)}...
                      </p>
                    </div>
                  )
                )}
                {activeTab === 'info' && <PoolInfo />}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8 rounded-lg bg-slate-800/50 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-white">Wallet Status</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-400">Connected Wallet</p>
                    <p className="font-mono text-sm text-white">
                      {connectedWallet?.slice(0, 8)}...{connectedWallet?.slice(-8)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Swap Permission</p>
                    <p className={`text-sm font-medium ${isAllowedSwapper ? 'text-green-400' : 'text-yellow-400'}`}>
                      {isAllowedSwapper ? '✓ Authorized' : '⚠ Liquidity Only'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Network</p>
                    <p className="text-sm text-white">Solana Devnet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
