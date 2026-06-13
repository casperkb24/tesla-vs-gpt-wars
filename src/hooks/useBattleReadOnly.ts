import { useQuery } from "@tanstack/react-query";
import type { PublicKey } from "@solana/web3.js";
import { fetchEscrowReadState, type EscrowReadState } from "@/lib/solana/escrowClient";
import { VSAI_DECIMALS, type BattleSideName } from "@/lib/solana/constants";

export type UiWalletState =
  | { status: "disconnected" }
  | { status: "connected"; address: string; balance: number; position: null }
  | {
      status: "connected";
      address: string;
      balance: number;
      position: {
        side: BattleSideName;
        amount: number;
        sol: number;
        usd: number;
        timeRemaining: string;
      };
    }
  | {
      status: "connected";
      address: string;
      balance: number;
      claim: {
        side: BattleSideName;
        principal: number;
        bonus: number;
        battleId: string | null;
      };
    };

function formatAmount(amount: bigint) {
  return Number(amount) / 10 ** VSAI_DECIMALS;
}

function formatTimeRemaining(createdAt?: bigint | null) {
  if (!createdAt) return "--:--:--";
  const startMs = Number(createdAt) * 1000;
  const endMs = startMs + 24 * 60 * 60 * 1000;
  const remaining = Math.max(0, endMs - Date.now());
  const h = Math.floor(remaining / 3.6e6);
  const m = Math.floor((remaining % 3.6e6) / 6e4);
  const s = Math.floor((remaining % 6e4) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function mapReadStateToUi(
  walletAddress: string | null,
  readState?: EscrowReadState,
): UiWalletState {
  if (!walletAddress) return { status: "disconnected" };

  const balance = readState?.tokenBalance ?? 0;
  const deposit = readState?.deposits.find((entry) => entry.account && !entry.account.claimed);

  if (!deposit?.account) {
    return { status: "connected", address: walletAddress, balance, position: null };
  }

  if (readState?.battle?.status === "resolved") {
    return {
      status: "connected",
      address: walletAddress,
      balance,
      claim: {
        side: deposit.account.side,
        principal: formatAmount(deposit.account.amount),
        bonus: 0,
        battleId: readState.battle.battleId.toString(),
      },
    };
  }

  return {
    status: "connected",
    address: walletAddress,
    balance,
    position: {
      side: deposit.account.side,
      amount: formatAmount(deposit.account.amount),
      sol: 0,
      usd: 0,
      timeRemaining: formatTimeRemaining(readState?.battle?.createdAt),
    },
  };
}

export function useBattleReadOnly(walletPublicKey: PublicKey | null, walletAddress: string | null) {
  const query = useQuery({
    queryKey: ["battle-read-only", walletAddress],
    queryFn: () => fetchEscrowReadState(walletPublicKey),
    refetchInterval: 15_000,
  });

  return {
    ...query,
    uiWallet: mapReadStateToUi(walletAddress, query.data),
  };
}
