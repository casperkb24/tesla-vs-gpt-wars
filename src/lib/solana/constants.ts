import { PublicKey } from "@solana/web3.js";

export const DEVNET_RPC_URL =
  import.meta.env.VITE_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";

export const BATTLE_ESCROW_PROGRAM_ID = new PublicKey(
  import.meta.env.VITE_BATTLE_ESCROW_PROGRAM_ID ??
    "EErVmLRGzemnC8BFBLkDVUvP7KXeU1W4e8ZxCdzm6FFj",
);

export const FALLBACK_DEVNET_VSAI_MINT = new PublicKey(
  import.meta.env.VITE_VSAI_MINT ??
    "9nGyXeK8gFg9U4odkCboaAnqbEvyLkUcZ7ybAq5VS1Bs",
);

export const KNOWN_BATTLE_PDA = import.meta.env.VITE_BATTLE_PDA
  ? new PublicKey(import.meta.env.VITE_BATTLE_PDA)
  : null;

export const VSAI_DECIMALS = Number(import.meta.env.VITE_VSAI_DECIMALS ?? 0);
export const VSAI_SOL_PRICE = Number(import.meta.env.VITE_VSAI_SOL_PRICE ?? 0);
export const DEFAULT_PUBLIC_KEY = PublicKey.default;

export const SIDE_SEEDS = {
  tesla: 0,
  gpt: 1,
} as const;

export type BattleSideName = keyof typeof SIDE_SEEDS;
