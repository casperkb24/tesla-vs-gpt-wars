/// <reference types="vite/client" />

interface PhantomSolanaProvider {
  isPhantom?: boolean;
  isConnected?: boolean;
  publicKey?: import("@solana/web3.js").PublicKey;
  connect: () => Promise<{ publicKey: import("@solana/web3.js").PublicKey }>;
  disconnect?: () => Promise<void>;
  signTransaction?: (transaction: import("@solana/web3.js").Transaction) => Promise<import("@solana/web3.js").Transaction>;
  signAndSendTransaction?: (transaction: import("@solana/web3.js").Transaction) => Promise<{ signature: string }>;
  on?: (event: "connect" | "disconnect" | "accountChanged", handler: (publicKey?: import("@solana/web3.js").PublicKey | null) => void) => void;
  removeListener?: (event: "connect" | "disconnect" | "accountChanged", handler: (publicKey?: import("@solana/web3.js").PublicKey | null) => void) => void;
}

interface Window {
  phantom?: {
    solana?: PhantomSolanaProvider;
  };
  solana?: PhantomSolanaProvider;
}
