import { useCallback, useEffect, useState } from "react";
import type { PublicKey } from "@solana/web3.js";

export type PhantomWalletState = {
  providerAvailable: boolean;
  connected: boolean;
  connecting: boolean;
  publicKey: PublicKey | null;
  address: string | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: PhantomSolanaProvider["signTransaction"] | null;
  signAndSendTransaction: PhantomSolanaProvider["signAndSendTransaction"] | null;
};

function getProvider() {
  const provider = window.phantom?.solana ?? window.solana;
  return provider?.isPhantom ? provider : null;
}

export function usePhantomWallet(): PhantomWalletState {
  const [provider, setProvider] = useState<PhantomSolanaProvider | null>(() => getProvider());
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectProvider = () => setProvider(getProvider());

    detectProvider();
    const id = window.setTimeout(detectProvider, 500);
    return () => window.clearTimeout(id);
  }, []);

  const connect = useCallback(async () => {
    if (!provider) {
      setError("Phantom is not available in this browser.");
      return;
    }

    setConnecting(true);
    setError(null);
    try {
      const result = await provider.connect();
      setPublicKey(result.publicKey);
    } catch (connectError) {
      setError(connectError instanceof Error ? connectError.message : "Wallet connection failed.");
    } finally {
      setConnecting(false);
    }
  }, [provider]);

  const disconnect = useCallback(async () => {
    if (provider?.disconnect) {
      await provider.disconnect();
    }
    setPublicKey(null);
  }, [provider]);

  useEffect(() => {
    if (!provider) return;

    if (provider.isConnected && provider.publicKey) {
      setPublicKey(provider.publicKey);
    }

    const handleConnect = (nextPublicKey?: PublicKey | null) => {
      setPublicKey(nextPublicKey ?? provider.publicKey ?? null);
    };
    const handleDisconnect = () => setPublicKey(null);
    const handleAccountChanged = (nextPublicKey?: PublicKey | null) => {
      setPublicKey(nextPublicKey ?? null);
    };

    provider.on?.("connect", handleConnect);
    provider.on?.("disconnect", handleDisconnect);
    provider.on?.("accountChanged", handleAccountChanged);

    return () => {
      provider.removeListener?.("connect", handleConnect);
      provider.removeListener?.("disconnect", handleDisconnect);
      provider.removeListener?.("accountChanged", handleAccountChanged);
    };
  }, [provider]);

  return {
    providerAvailable: Boolean(provider),
    connected: Boolean(publicKey),
    connecting,
    publicKey,
    address: publicKey?.toBase58() ?? null,
    error,
    connect,
    disconnect,
    signTransaction: provider?.signTransaction ?? null,
    signAndSendTransaction: provider?.signAndSendTransaction ?? null,
  };
}
