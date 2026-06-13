import { PublicKey } from "@solana/web3.js";
import type { BattleSideName } from "./constants";

export type BattleStatus = "active" | "resolved";

export type EscrowConfig = {
  admin: PublicKey;
  activeBattle: PublicKey;
  bump: number;
};

export type EscrowBattle = {
  admin: PublicKey;
  battleId: bigint;
  mint: PublicKey;
  vault: PublicKey;
  status: BattleStatus;
  createdAt: bigint;
  resolvedAt: bigint;
  bump: number;
  vaultBump: number;
};

export type EscrowDeposit = {
  wallet: PublicKey;
  battle: PublicKey;
  battleId: bigint;
  side: BattleSideName;
  amount: bigint;
  timestamp: bigint;
  claimed: boolean;
  bump: number;
};

function view(data: Uint8Array, offset: number, length: number) {
  return new DataView(data.buffer, data.byteOffset + offset, length);
}

function readPublicKey(data: Uint8Array, offset: number) {
  return {
    value: new PublicKey(data.slice(offset, offset + 32)),
    offset: offset + 32,
  };
}

function readU8(data: Uint8Array, offset: number) {
  return { value: data[offset], offset: offset + 1 };
}

function readBool(data: Uint8Array, offset: number) {
  return { value: data[offset] !== 0, offset: offset + 1 };
}

function readU64(data: Uint8Array, offset: number) {
  return { value: view(data, offset, 8).getBigUint64(0, true), offset: offset + 8 };
}

function readI64(data: Uint8Array, offset: number) {
  return { value: view(data, offset, 8).getBigInt64(0, true), offset: offset + 8 };
}

export function decodeConfig(data: Uint8Array): EscrowConfig {
  let offset = 8;
  const admin = readPublicKey(data, offset);
  offset = admin.offset;
  const activeBattle = readPublicKey(data, offset);
  offset = activeBattle.offset;
  const bump = readU8(data, offset);
  return { admin: admin.value, activeBattle: activeBattle.value, bump: bump.value };
}

export function decodeBattle(data: Uint8Array): EscrowBattle {
  let offset = 8;
  const admin = readPublicKey(data, offset);
  offset = admin.offset;
  const battleId = readU64(data, offset);
  offset = battleId.offset;
  const mint = readPublicKey(data, offset);
  offset = mint.offset;
  const vault = readPublicKey(data, offset);
  offset = vault.offset;
  const status = readU8(data, offset);
  offset = status.offset;
  const createdAt = readI64(data, offset);
  offset = createdAt.offset;
  const resolvedAt = readI64(data, offset);
  offset = resolvedAt.offset;
  const bump = readU8(data, offset);
  offset = bump.offset;
  const vaultBump = readU8(data, offset);
  return {
    admin: admin.value,
    battleId: battleId.value,
    mint: mint.value,
    vault: vault.value,
    status: status.value === 0 ? "active" : "resolved",
    createdAt: createdAt.value,
    resolvedAt: resolvedAt.value,
    bump: bump.value,
    vaultBump: vaultBump.value,
  };
}

export function decodeDeposit(data: Uint8Array): EscrowDeposit {
  let offset = 8;
  const wallet = readPublicKey(data, offset);
  offset = wallet.offset;
  const battle = readPublicKey(data, offset);
  offset = battle.offset;
  const battleId = readU64(data, offset);
  offset = battleId.offset;
  const side = readU8(data, offset);
  offset = side.offset;
  const amount = readU64(data, offset);
  offset = amount.offset;
  const timestamp = readI64(data, offset);
  offset = timestamp.offset;
  const claimed = readBool(data, offset);
  offset = claimed.offset;
  const bump = readU8(data, offset);
  return {
    wallet: wallet.value,
    battle: battle.value,
    battleId: battleId.value,
    side: side.value === 0 ? "tesla" : "gpt",
    amount: amount.value,
    timestamp: timestamp.value,
    claimed: claimed.value,
    bump: bump.value,
  };
}
