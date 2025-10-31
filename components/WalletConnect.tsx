'use client';

import { useState } from 'react';

interface WalletConnectProps {
  connectedWallet: string | null;
  onConnect: (wallet: string | null) => void;
}

export default function WalletConnect({ connectedWallet, onConnect }: WalletConnectProps) {
  const [showWallets, setShowWallets] = useState(false);

  const handleConnect = (walletName: string) => {
    const mockWallet = `${walletName.toUpperCase()}_MOCK_${Math.random()
      .toString(36)
      .substring(7)}`;
    onConnect(mockWallet);
    setShowWallets(false);
  };

  const handleDisconnect = () => {
    onConnect(null);
  };

  if (connectedWallet) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowWallets(!showWallets)}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          {connectedWallet.slice(0, 8)}...{connectedWallet.slice(-4)}
        </button>
        {showWallets && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-slate-800 p-2 shadow-xl">
            <button
              onClick={handleDisconnect}
              className="w-full rounded-md px-4 py-2 text-left text-sm text-white transition-colors hover:bg-slate-700"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowWallets(!showWallets)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Connect Wallet
      </button>
      {showWallets && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-slate-800 p-2 shadow-xl">
          <button
            onClick={() => handleConnect('phantom')}
            className="w-full rounded-md px-4 py-2 text-left text-sm text-white transition-colors hover:bg-slate-700"
          >
            Phantom
          </button>
          <button
            onClick={() => handleConnect('solflare')}
            className="w-full rounded-md px-4 py-2 text-left text-sm text-white transition-colors hover:bg-slate-700"
          >
            Solflare
          </button>
          <button
            onClick={() => handleConnect('backpack')}
            className="w-full rounded-md px-4 py-2 text-left text-sm text-white transition-colors hover:bg-slate-700"
          >
            Backpack
          </button>
        </div>
      )}
    </div>
  );
}
