'use client';

import { createAppKit } from '@reown/appkit/react';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks';

// 0️⃣ Set up Solana adapter
const solanaWeb3JsAdapter = new SolanaAdapter();

// 1️⃣ Your Project ID from https://dashboard.reown.com
const projectId = '18a0ffb9ea16b31995d8a7c75e86fcd0'; // <-- replace with actual ID

// 2️⃣ Optional metadata
const metadata = {
  name: 'My Solana dApp',
  description: 'Solana dApp using Reown AppKit',
  url: 'https://yourdomain.com',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// 3️⃣ Initialize AppKit
createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solana, solanaTestnet, solanaDevnet],
  metadata,
  projectId,
  features: {
    analytics: true,
  },
});
