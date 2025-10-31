'use client';

import { useEffect } from 'react';
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';

interface WalletConnectProps {
  connectedWallet: string | null;
  onConnect: (wallet: string | null) => void;
}

export default function CustomConnectButton({ connectedWallet, onConnect }: WalletConnectProps) {
  const { open } = useAppKit(); // controls modal visibility
  const { address, isConnected } = useAppKitAccount(); //
  const { disconnect } = useDisconnect(); // disconnects

  useEffect(() => {
    if (isConnected && address) {
      onConnect(address);
    } else {
      onConnect(null);
    }
  }, [isConnected, address, onConnect]);
  const handleClick = () => {
    if (isConnected) {
      disconnect(); // ✅ correctly disconnects the wallet
    } else {
      open({ view: 'Connect', namespace: 'solana' }); // ✅ opens Solana wallet modal
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-5 py-2 rounded-2xl font-semibold transition ${
        isConnected
          ? 'rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700'
          : 'rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700'
      }`}
    >
      {isConnected && address ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'Connect Wallet'}
    </button>
  );
}
