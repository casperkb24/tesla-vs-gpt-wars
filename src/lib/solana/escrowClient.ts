import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import {
  BATTLE_ESCROW_PROGRAM_ID,
  DEFAULT_PUBLIC_KEY,
  DEVNET_RPC_URL,
  FALLBACK_DEVNET_VSAI_MINT,
  KNOWN_BATTLE_PDA,
  SIDE_SEEDS,
  VSAI_DECIMALS,
  VSAI_SOL_PRICE,
  type BattleSideName,
} from "./constants";
import {
  decodeBattle,
  decodeConfig,
  decodeDeposit,
  type EscrowBattle,
  type EscrowConfig,
  type EscrowDeposit,
} from "./escrowDecode";

const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
const LOCK_TOKENS_DISCRIMINATOR = [136, 11, 32, 232, 161, 117, 54, 211];
const CLAIM_DISCRIMINATOR = [62, 198, 214, 193, 213, 159, 108, 210];
const DEPOSIT_ACCOUNT_SIZE = 8 + 32 + 32 + 8 + 1 + 8 + 8 + 1 + 1;
const DEPOSIT_BATTLE_OFFSET = 8 + 32;

export type WalletDeposit = {
  side: BattleSideName;
  pda: PublicKey;
  account: EscrowDeposit | null;
};

export type AccountReadMeta = {
  exists: boolean;
  owner: string | null;
  lamports: number | null;
  dataLength: number;
  dataBase64: string | null;
  dataHex: string | null;
};

export type EscrowReadState = {
  configPda: PublicKey;
  configRead: AccountReadMeta;
  config: EscrowConfig | null;
  battlePda: PublicKey | null;
  battlePdaSource: "active-config" | "env-known-battle" | "none";
  battle: EscrowBattle | null;
  vsaiMint: PublicKey;
  mintSource: "battle-account" | "fallback-env";
  tokenBalance: number;
  tokenAccount: PublicKey | null;
  deposits: WalletDeposit[];
  battleDeposits: EscrowDeposit[];
  metrics: {
    teslaAmount: number;
    gptAmount: number;
    totalDeposited: number;
    vaultAmount: number | null;
    teslaPct: number;
    gptPct: number;
    leader: BattleSideName | "tie";
    solLocked: number | null;
    solPrice: number;
    source: "live-battle" | "no-active-battle";
  };
};

export function getConnection() {
  return new Connection(DEVNET_RPC_URL, "confirmed");
}

export function deriveConfigPda() {
  return PublicKey.findProgramAddressSync(
    [new TextEncoder().encode("config")],
    BATTLE_ESCROW_PROGRAM_ID,
  )[0];
}

export function deriveDepositPda(battle: PublicKey, wallet: PublicKey, side: BattleSideName) {
  return PublicKey.findProgramAddressSync(
    [
      new TextEncoder().encode("deposit"),
      battle.toBuffer(),
      wallet.toBuffer(),
      new Uint8Array([SIDE_SEEDS[side]]),
    ],
    BATTLE_ESCROW_PROGRAM_ID,
  )[0];
}

export function deriveAssociatedTokenAddress(mint: PublicKey, wallet: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )[0];
}

function bytesToHex(data: Uint8Array) {
  return Array.from(data)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function bytesToBase64(data: Uint8Array) {
  let binary = "";
  data.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

async function fetchAccountRead(connection: Connection, pda: PublicKey): Promise<AccountReadMeta & { data: Buffer | null }> {
  const account = await connection.getAccountInfo(pda, "confirmed");
  const data = account?.data ?? null;
  return {
    exists: Boolean(account),
    owner: account?.owner.toBase58() ?? null,
    lamports: account?.lamports ?? null,
    dataLength: data?.length ?? 0,
    dataBase64: data ? bytesToBase64(data) : null,
    dataHex: data ? bytesToHex(data) : null,
    data,
  };
}

async function fetchAccountData(connection: Connection, pda: PublicKey) {
  return (await fetchAccountRead(connection, pda)).data;
}

export async function fetchConfig(connection = getConnection()) {
  const data = await fetchAccountData(connection, deriveConfigPda());
  return data ? decodeConfig(data) : null;
}

export async function fetchBattle(pda: PublicKey, connection = getConnection()) {
  const data = await fetchAccountData(connection, pda);
  return data ? decodeBattle(data) : null;
}

export async function fetchDeposit(
  battle: PublicKey,
  wallet: PublicKey,
  side: BattleSideName,
  connection = getConnection(),
) {
  const pda = deriveDepositPda(battle, wallet, side);
  const data = await fetchAccountData(connection, pda);
  return {
    side,
    pda,
    account: data ? decodeDeposit(data) : null,
  };
}

export async function fetchTokenBalance(
  wallet: PublicKey,
  mint: PublicKey,
  connection = getConnection(),
) {
  const tokenAccount = deriveAssociatedTokenAddress(mint, wallet);
  try {
    const balance = await connection.getTokenAccountBalance(tokenAccount, "confirmed");
    return {
      tokenAccount,
      amount: Number(balance.value.amount) / 10 ** VSAI_DECIMALS,
    };
  } catch {
    return { tokenAccount, amount: 0 };
  }
}

export async function fetchTokenAccountAmount(tokenAccount: PublicKey, connection = getConnection()) {
  try {
    const balance = await connection.getTokenAccountBalance(tokenAccount, "confirmed");
    return Number(balance.value.amount) / 10 ** VSAI_DECIMALS;
  } catch {
    return null;
  }
}

export async function fetchBattleDeposits(battle: PublicKey, connection = getConnection()) {
  const accounts = await connection.getProgramAccounts(BATTLE_ESCROW_PROGRAM_ID, {
    commitment: "confirmed",
    filters: [
      { dataSize: DEPOSIT_ACCOUNT_SIZE },
      { memcmp: { offset: DEPOSIT_BATTLE_OFFSET, bytes: battle.toBase58() } },
    ],
  });

  return accounts.map((entry) => decodeDeposit(entry.account.data));
}

function formatAmount(amount: bigint) {
  return Number(amount) / 10 ** VSAI_DECIMALS;
}

function buildMetrics(
  battle: EscrowBattle | null,
  battleDeposits: EscrowDeposit[],
  vaultAmount: number | null,
): EscrowReadState["metrics"] {
  const activeDeposits = battleDeposits.filter((deposit) => !deposit.claimed);
  const teslaAmount = activeDeposits
    .filter((deposit) => deposit.side === "tesla")
    .reduce((sum, deposit) => sum + formatAmount(deposit.amount), 0);
  const gptAmount = activeDeposits
    .filter((deposit) => deposit.side === "gpt")
    .reduce((sum, deposit) => sum + formatAmount(deposit.amount), 0);
  const totalDeposited = teslaAmount + gptAmount;
  const teslaPct = totalDeposited > 0 ? (teslaAmount / totalDeposited) * 100 : 50;
  const gptPct = totalDeposited > 0 ? (gptAmount / totalDeposited) * 100 : 50;
  const leader = teslaAmount > gptAmount ? "tesla" : gptAmount > teslaAmount ? "gpt" : "tie";
  const livePoolAmount = vaultAmount ?? totalDeposited;
  const solLocked = VSAI_SOL_PRICE > 0 ? livePoolAmount * VSAI_SOL_PRICE : null;

  return {
    teslaAmount,
    gptAmount,
    totalDeposited,
    vaultAmount,
    teslaPct,
    gptPct,
    leader,
    solLocked,
    solPrice: VSAI_SOL_PRICE,
    source: battle ? "live-battle" : "no-active-battle",
  };
}

export async function fetchEscrowReadState(wallet?: PublicKey | null): Promise<EscrowReadState> {
  const connection = getConnection();
  const configPda = deriveConfigPda();
  const configRead = await fetchAccountRead(connection, configPda);
  const config = configRead.data ? decodeConfig(configRead.data) : null;
  const activeBattle =
    config && !config.activeBattle.equals(DEFAULT_PUBLIC_KEY) ? config.activeBattle : null;
  const battlePda = activeBattle ?? KNOWN_BATTLE_PDA;
  const battlePdaSource = activeBattle ? "active-config" : KNOWN_BATTLE_PDA ? "env-known-battle" : "none";
  const battle = battlePda ? await fetchBattle(battlePda, connection) : null;
  const vsaiMint = battle?.mint ?? FALLBACK_DEVNET_VSAI_MINT;
  const mintSource = battle?.mint ? "battle-account" : "fallback-env";
  const [battleDeposits, vaultAmount] = battle
    ? await Promise.all([
        fetchBattleDeposits(battlePda!, connection),
        fetchTokenAccountAmount(battle.vault, connection),
      ])
    : [[], null];
  const metrics = buildMetrics(battle, battleDeposits, vaultAmount);
  const balance = wallet
    ? await fetchTokenBalance(wallet, vsaiMint, connection)
    : { tokenAccount: null, amount: 0 };
  const deposits =
    wallet && battlePda
      ? await Promise.all([
          fetchDeposit(battlePda, wallet, "tesla", connection),
          fetchDeposit(battlePda, wallet, "gpt", connection),
        ])
      : [];

  return {
    configPda,
    configRead,
    config,
    battlePda,
    battlePdaSource,
    battle,
    vsaiMint,
    mintSource,
    tokenBalance: balance.amount,
    tokenAccount: balance.tokenAccount,
    deposits,
    battleDeposits,
    metrics,
  };
}

function encodeLockTokensData(side: BattleSideName, amount: bigint) {
  const data = new Uint8Array(17);
  data.set(LOCK_TOKENS_DISCRIMINATOR, 0);
  data[8] = SIDE_SEEDS[side];
  new DataView(data.buffer).setBigUint64(9, amount, true);
  return Buffer.from(data);
}

export async function buildLockTokensTransaction({
  readState,
  wallet,
  side,
  amount,
}: {
  readState: EscrowReadState;
  wallet: PublicKey;
  side: BattleSideName;
  amount: number;
}) {
  if (!readState.battlePda || !readState.battle) {
    throw new Error("No active battle is available.");
  }
  if (readState.battle.status !== "active") {
    throw new Error("The battle is not active.");
  }
  if (amount <= 0) {
    throw new Error("Deposit amount must be greater than zero.");
  }

  const connection = getConnection();
  const rawAmount = BigInt(Math.round(amount * 10 ** VSAI_DECIMALS));
  const depositPda = deriveDepositPda(readState.battlePda, wallet, side);
  const userTokenAccount = deriveAssociatedTokenAddress(readState.battle.mint, wallet);
  const instructionDiscriminator = LOCK_TOKENS_DISCRIMINATOR;
  const accountMetas = [
    { pubkey: readState.configPda, isSigner: false, isWritable: false },
    { pubkey: readState.battlePda, isSigner: false, isWritable: true },
    { pubkey: depositPda, isSigner: false, isWritable: true },
    { pubkey: wallet, isSigner: true, isWritable: true },
    { pubkey: userTokenAccount, isSigner: false, isWritable: true },
    { pubkey: readState.battle.vault, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ];
  const latest = await connection.getLatestBlockhash("confirmed");
  const instruction = new TransactionInstruction({
    programId: BATTLE_ESCROW_PROGRAM_ID,
    keys: accountMetas,
    data: encodeLockTokensData(side, rawAmount),
  });
  const transaction = new Transaction({
    feePayer: wallet,
    recentBlockhash: latest.blockhash,
  }).add(instruction);

  return {
    transaction,
    latest,
    depositPda,
    userTokenAccount,
    vaultTokenAccount: readState.battle.vault,
    rawAmount,
    instructionDiscriminator,
    accountMetas,
  };
}

export async function buildClaimTransaction({
  readState,
  wallet,
}: {
  readState: EscrowReadState;
  wallet: PublicKey;
}) {
  if (!readState.battlePda || !readState.battle) {
    throw new Error("No battle is available.");
  }
  if (readState.battle.status !== "resolved") {
    throw new Error("The battle is not resolved.");
  }

  const deposit = readState.deposits.find((entry) => entry.account && !entry.account.claimed);
  if (!deposit?.account) {
    throw new Error("No claimable deposit was found for this wallet.");
  }

  const connection = getConnection();
  const userTokenAccount = deriveAssociatedTokenAddress(readState.battle.mint, wallet);
  const accountMetas = [
    { pubkey: readState.battlePda, isSigner: false, isWritable: false },
    { pubkey: deposit.pda, isSigner: false, isWritable: true },
    { pubkey: wallet, isSigner: true, isWritable: false },
    { pubkey: userTokenAccount, isSigner: false, isWritable: true },
    { pubkey: readState.battle.vault, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  ];
  const latest = await connection.getLatestBlockhash("confirmed");
  const instruction = new TransactionInstruction({
    programId: BATTLE_ESCROW_PROGRAM_ID,
    keys: accountMetas,
    data: Buffer.from(CLAIM_DISCRIMINATOR),
  });
  const transaction = new Transaction({
    feePayer: wallet,
    recentBlockhash: latest.blockhash,
  }).add(instruction);

  return {
    transaction,
    latest,
    depositPda: deposit.pda,
    deposit: deposit.account,
    userTokenAccount,
    vaultTokenAccount: readState.battle.vault,
    instructionDiscriminator: CLAIM_DISCRIMINATOR,
    accountMetas,
  };
}
