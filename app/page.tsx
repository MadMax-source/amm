'use client';

import { useState } from 'react';
import WalletConnect from '@/components/WalletConnect';
import CreatePool from '@/components/CreatePool';
import AddLiquidity from '@/components/AddLiquidity';
import RemoveLiquidity from '@/components/RemoveLiquidity';
import SwapTokens from '@/components/SwapTokens';
import PoolInfo from '@/components/PoolInfo';
import CustomConnectButton from '@/components/CustomConnectButton';

export default function Home() {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [allowedSwapper] = useState<string>('ALLOWED_SWAP_PUBKEY_HERE');
  const [activeTab, setActiveTab] = useState<'create' | 'add' | 'remove' | 'swap' | 'info'>('swap');

  const isAllowedSwapper = connectedWallet === allowedSwapper;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Solana AMM</h1>
            {/*
            <WalletConnect connectedWallet={connectedWallet} onConnect={setConnectedWallet} />

            */}

            <CustomConnectButton connectedWallet={connectedWallet} onConnect={setConnectedWallet} />
          </div>
        </header>

        {!connectedWallet ? (
          <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="max-w-3xl text-center">
              <div className="mb-6 text-5xl sm:text-6xl">💧</div>
              <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
                Solana Automated Market Maker
              </h2>
              <p className="mb-8 text-base leading-relaxed text-slate-300 sm:text-lg">
                A decentralized liquidity protocol built on Solana. Create liquidity pools, provide
                liquidity to earn fees, swap tokens instantly, and participate in DeFi with low
                transaction costs and fast settlement times.
              </p>

              <div className="mb-8 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm">
                  <div className="mb-2 text-2xl">🏊</div>
                  <h3 className="mb-1 font-semibold text-white">Create Pools</h3>
                  <p className="text-sm text-slate-400">
                    Launch new liquidity pools for any token pair
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm">
                  <div className="mb-2 text-2xl">💰</div>
                  <h3 className="mb-1 font-semibold text-white">Add Liquidity</h3>
                  <p className="text-sm text-slate-400">Provide liquidity and earn trading fees</p>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm">
                  <div className="mb-2 text-2xl">🔄</div>
                  <h3 className="mb-1 font-semibold text-white">Swap Tokens</h3>
                  <p className="text-sm text-slate-400">
                    Trade tokens instantly with minimal slippage
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm">
                  <div className="mb-2 text-2xl">📊</div>
                  <h3 className="mb-1 font-semibold text-white">Track Pools</h3>
                  <p className="text-sm text-slate-400">
                    Monitor reserves, prices, and your positions
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                <p className="text-sm text-blue-300 sm:text-base">
                  Connect your Solana wallet to get started with trading and providing liquidity
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6 flex gap-2 overflow-x-auto rounded-lg bg-slate-800/50 p-2">
                <button
                  onClick={() => setActiveTab('swap')}
                  className={`whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                    activeTab === 'swap'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Swap
                </button>
                <button
                  onClick={() => setActiveTab('create')}
                  className={`whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                    activeTab === 'create'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Create Pool
                </button>
                <button
                  onClick={() => setActiveTab('add')}
                  className={`whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                    activeTab === 'add'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Add Liquidity
                </button>
                <button
                  onClick={() => setActiveTab('remove')}
                  className={`whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                    activeTab === 'remove'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Remove Liquidity
                </button>

                <button
                  onClick={() => setActiveTab('info')}
                  className={`whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                    activeTab === 'info'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Pool Info
                </button>
              </div>

              <div className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm sm:p-6">
                {activeTab === 'swap' && <SwapTokens connectedWallet={connectedWallet} />}
                {activeTab === 'create' && <CreatePool />}
                {activeTab === 'add' && <AddLiquidity />}
                {activeTab === 'remove' && <RemoveLiquidity />}
                {activeTab === 'info' && <PoolInfo />}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm sm:p-6 lg:sticky lg:top-8">
                <h3 className="mb-4 text-base font-semibold text-white sm:text-lg">
                  Wallet Status
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-400 sm:text-sm">Connected Wallet</p>
                    <p className="break-all font-mono text-xs text-white sm:text-sm">
                      {connectedWallet?.slice(0, 8)}...{connectedWallet?.slice(-8)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 sm:text-sm">Swap Permission</p>
                    <p
                      className={`text-xs font-medium sm:text-sm ${
                        isAllowedSwapper ? 'text-green-400' : 'text-yellow-400'
                      }`}
                    >
                      {isAllowedSwapper ? '✓ Authorized' : '⚠ Liquidity Only'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 sm:text-sm">Network</p>
                    <p className="text-xs text-white sm:text-sm">Solana Mainnet</p>
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
