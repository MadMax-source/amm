'use client';

import { createAppKit } from '@reown/appkit/react';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks';
import React from 'react';

const solanaWeb3JsAdapter = new SolanaAdapter();

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '18a0ffb9ea16b31995d8a7c75e86fcd0';

const metadata = {
  name: 'Video Token',
  description: 'Video Token dApp using Reown + Solana',
  url: 'https://yourdomain.com',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solana, solanaDevnet, solanaTestnet],
  metadata,
  projectId,
  features: {
    analytics: true,
  },
});

export default function ReownProvider({ children }: { children: React.ReactNode }) {
  // Reown injects global elements like <appkit-button />
  return <>{children}</>;
}
