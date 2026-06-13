import { useEffect, useState, useRef } from "react";
import {
  Radio,
  Swords,
  Clock,
  Lock,
  PlayCircle,
  Trophy,
  Plug,
  Target,
  Gift,
  Repeat,
  Video,
  Rocket,
  Database,
  Zap,
  Copy,
  Check,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBattleReadOnly, type UiWalletState } from "@/hooks/useBattleReadOnly";
import { usePhantomWallet } from "@/hooks/usePhantomWallet";
import { DEFAULT_PUBLIC_KEY, FALLBACK_DEVNET_VSAI_MINT } from "@/lib/solana/constants";
import { buildClaimTransaction, buildLockTokensTransaction, getConnection, type EscrowReadState } from "@/lib/solana/escrowClient";
import txSecurity from "@/assets/tx-security.mp4.asset.json";
import txBreach from "@/assets/tx-breach.mov.asset.json";
import txIncoming from "@/assets/tx-incoming.mp4.asset.json";
import pumpPill from "@/assets/pump-pill.asset.json";
import phantomGhost from "@/assets/phantom-ghost.asset.json";

const TELEGRAM_URL = "https://t.me/AI_war_casperKObe24";
const X_URL = "https://x.com/casperkobe24?s=21";
const PUMP_URL = "https://pump.fun";

type WalletState = UiWalletState;

const short = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`;
const formatTokenAmount = (amount: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(amount);
const formatPct = (amount: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(amount);
const formatSol = (amount: number | null) =>
  amount === null ? "◎ --" : `◎ ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(amount)}`;
const DEVNET_LOCK_AMOUNT = 1;

const serializeWalletError = (error: unknown) => {
  const walletError = error as {
    code?: unknown;
    name?: unknown;
    message?: unknown;
    stack?: unknown;
    originalError?: unknown;
    walletError?: unknown;
    phantomError?: unknown;
  };

  return {
    code: walletError?.code,
    name: walletError?.name,
    message: walletError?.message,
    stack: walletError?.stack,
    originalError: walletError?.originalError,
    walletError: walletError?.walletError,
    phantomError: walletError?.phantomError,
  };
};

const snapshotTransaction = (transaction: import("@solana/web3.js").Transaction) => {
  let serializedBase64: string | null = null;
  let serializationError: string | null = null;

  try {
    serializedBase64 = transaction
      .serialize({ requireAllSignatures: false, verifySignatures: false })
      .toString("base64");
  } catch (error) {
    serializationError = error instanceof Error ? error.message : "Unable to serialize transaction.";
  }

  return {
    feePayer: transaction.feePayer?.toBase58() ?? null,
    recentBlockhash: transaction.recentBlockhash ?? null,
    lastValidBlockHeight: transaction.lastValidBlockHeight ?? null,
    signatures: transaction.signatures.map((signature) => ({
      publicKey: signature.publicKey.toBase58(),
      signature: signature.signature ? Buffer.from(signature.signature).toString("base64") : null,
    })),
    instructionCount: transaction.instructions.length,
    instructions: transaction.instructions.map((instruction, index) => ({
      index,
      programId: instruction.programId.toBase58(),
      keys: instruction.keys.map((key) => ({
        pubkey: key.pubkey.toBase58(),
        isSigner: key.isSigner,
        isWritable: key.isWritable,
      })),
      dataBase64: Buffer.from(instruction.data).toString("base64"),
    })),
    serializedBase64,
    serializedLength: serializedBase64 ? Buffer.from(serializedBase64, "base64").length : null,
    serializationError,
  };
};

const logTransactionSnapshot = (
  label: string,
  snapshot: ReturnType<typeof snapshotTransaction> | Record<string, unknown>,
) => {
  console.log(label, snapshot);
  console.log(`${label} JSON`, JSON.stringify(snapshot, null, 2));
};

const compareTransactions = (
  locallySimulated: ReturnType<typeof snapshotTransaction>,
  phantomHandoff: ReturnType<typeof snapshotTransaction>,
) => ({
  feePayer: {
    local: locallySimulated.feePayer,
    phantom: phantomHandoff.feePayer,
    same: locallySimulated.feePayer === phantomHandoff.feePayer,
  },
  recentBlockhash: {
    local: locallySimulated.recentBlockhash,
    phantom: phantomHandoff.recentBlockhash,
    same: locallySimulated.recentBlockhash === phantomHandoff.recentBlockhash,
  },
  lastValidBlockHeight: {
    local: locallySimulated.lastValidBlockHeight,
    phantom: phantomHandoff.lastValidBlockHeight,
    same: locallySimulated.lastValidBlockHeight === phantomHandoff.lastValidBlockHeight,
  },
  signatures: {
    local: locallySimulated.signatures,
    phantom: phantomHandoff.signatures,
    same: JSON.stringify(locallySimulated.signatures) === JSON.stringify(phantomHandoff.signatures),
  },
  instructionCount: {
    local: locallySimulated.instructionCount,
    phantom: phantomHandoff.instructionCount,
    same: locallySimulated.instructionCount === phantomHandoff.instructionCount,
  },
  instructionProgramIds: {
    local: locallySimulated.instructions.map((instruction) => instruction.programId),
    phantom: phantomHandoff.instructions.map((instruction) => instruction.programId),
    same:
      JSON.stringify(locallySimulated.instructions.map((instruction) => instruction.programId)) ===
      JSON.stringify(phantomHandoff.instructions.map((instruction) => instruction.programId)),
  },
  instructionDataBase64: {
    local: locallySimulated.instructions.map((instruction) => instruction.dataBase64),
    phantom: phantomHandoff.instructions.map((instruction) => instruction.dataBase64),
    same:
      JSON.stringify(locallySimulated.instructions.map((instruction) => instruction.dataBase64)) ===
      JSON.stringify(phantomHandoff.instructions.map((instruction) => instruction.dataBase64)),
  },
  accountMetas: {
    local: locallySimulated.instructions.map((instruction) => instruction.keys),
    phantom: phantomHandoff.instructions.map((instruction) => instruction.keys),
    same:
      JSON.stringify(locallySimulated.instructions.map((instruction) => instruction.keys)) ===
      JSON.stringify(phantomHandoff.instructions.map((instruction) => instruction.keys)),
  },
  serializedBase64: {
    local: locallySimulated.serializedBase64,
    phantom: phantomHandoff.serializedBase64,
    same: locallySimulated.serializedBase64 === phantomHandoff.serializedBase64,
  },
  serializedLength: {
    local: locallySimulated.serializedLength,
    phantom: phantomHandoff.serializedLength,
    same: locallySimulated.serializedLength === phantomHandoff.serializedLength,
  },
});

const Index = () => {
  const phantom = usePhantomWallet();
  const battleRead = useBattleReadOnly(phantom.publicKey, phantom.address);
  const [lockStatus, setLockStatus] = useState<string | null>(null);
  const [lockPendingSide, setLockPendingSide] = useState<"tesla" | "gpt" | null>(null);
  const [claimStatus, setClaimStatus] = useState<string | null>(null);
  const [claimPending, setClaimPending] = useState(false);
  const wallet = battleRead.uiWallet;
  const displayVsaiCa = battleRead.data?.vsaiMint.toBase58() ?? FALLBACK_DEVNET_VSAI_MINT.toBase58();
  const buyUrl = `https://phantom.app/ul/browse/${encodeURIComponent(
    `https://jup.ag/swap/SOL-${displayVsaiCa}`,
  )}/jup.ag`;
  const battleLabel = battleRead.data?.battle?.battleId
    ? `battle #${battleRead.data.battle.battleId.toString()}`
    : "battle pending";
  const battleStatus = battleRead.data?.battle?.status === "resolved" ? "resolved" : "in progress";
  const metrics = battleRead.data?.metrics;
  const teslaPowerPct = metrics?.teslaPct ?? 50;
  const gptPowerPct = metrics?.gptPct ?? 50;
  const teslaCommitted = metrics?.teslaAmount ?? 0;
  const gptCommitted = metrics?.gptAmount ?? 0;
  const poolSize = metrics?.vaultAmount ?? metrics?.totalDeposited ?? 0;
  const leaderLabel =
    metrics?.leader === "tesla" ? "TESLA" : metrics?.leader === "gpt" ? "GPT" : "TIE";
  const metricsSource = metrics?.source === "live-battle" ? "live vault + deposits" : "awaiting active battle";
  const canLockSide =
    wallet.status === "connected" &&
    "position" in wallet &&
    !wallet.position &&
    wallet.balance >= DEVNET_LOCK_AMOUNT &&
    battleRead.data?.battle?.status === "active" &&
    Boolean(phantom.publicKey && (phantom.signTransaction || phantom.signAndSendTransaction)) &&
    !lockPendingSide;
  const canClaim =
    wallet.status === "connected" &&
    "claim" in wallet &&
    battleRead.data?.battle?.status === "resolved" &&
    Boolean(phantom.publicKey && (phantom.signTransaction || phantom.signAndSendTransaction)) &&
    !claimPending;

  const pick = async (side: "tesla" | "gpt") => {
    if (!battleRead.data || !phantom.publicKey || (!phantom.signTransaction && !phantom.signAndSendTransaction)) {
      setLockStatus(`${side.toUpperCase()} lock unavailable: wallet or battle state is not ready.`);
      return;
    }

    const sideLabel = side.toUpperCase();
    setLockPendingSide(side);
    setLockStatus(`Preparing 1 $VSAI ${sideLabel} deposit...`);
    let step = "start";
    try {
      step = "transaction build";
      const {
        transaction,
        depositPda,
        userTokenAccount,
        vaultTokenAccount,
        rawAmount,
        instructionDiscriminator,
        accountMetas,
      } = await buildLockTokensTransaction({
        readState: battleRead.data,
        wallet: phantom.publicKey,
        side,
        amount: DEVNET_LOCK_AMOUNT,
      });
      step = "debug payload";
      const debugPayload = {
        activeBattle: battleRead.data.config?.activeBattle.toBase58() ?? null,
        battlePda: battleRead.data.battlePda?.toBase58() ?? null,
        mint: battleRead.data.battle?.mint.toBase58() ?? null,
        vault: battleRead.data.battle?.vault.toBase58() ?? null,
        wallet: phantom.publicKey.toBase58(),
        walletTokenAccount: userTokenAccount.toBase58(),
        vaultTokenAccount: vaultTokenAccount.toBase58(),
        depositPda: depositPda.toBase58(),
        side,
        instructionDiscriminator,
        accountMetas: accountMetas.map((meta) => ({
          pubkey: meta.pubkey.toBase58(),
          isSigner: meta.isSigner,
          isWritable: meta.isWritable,
        })),
        amount: {
          uiAmount: DEVNET_LOCK_AMOUNT,
          rawAmount: rawAmount.toString(),
        },
      };
      console.log(`${sideLabel} DEPOSIT DEBUG`, debugPayload);
      const beforeSimulationSnapshot = snapshotTransaction(transaction);
      logTransactionSnapshot(`${sideLabel} TRANSACTION SNAPSHOT BEFORE SIMULATION`, beforeSimulationSnapshot);

      step = "simulateTransaction";
      const connection = getConnection();
      const afterFreshBlockhashSnapshot = {
        latestBlockhash: "from direct-style builder",
        transaction: snapshotTransaction(transaction),
      };
      logTransactionSnapshot(`${sideLabel} TRANSACTION SNAPSHOT AFTER DIRECT-STYLE BUILD`, afterFreshBlockhashSnapshot);

      let simulation;
      try {
        simulation = await connection.simulateTransaction(transaction, undefined, false);
      } catch (simulationError) {
        console.error(`${sideLabel} DEPOSIT ERROR`, {
          step,
          error: simulationError,
          message: simulationError?.message,
          stack: simulationError?.stack,
        });
        throw simulationError;
      }

      console.log(`${sideLabel} DEPOSIT SIMULATION`, {
        error: simulation.value.err,
        logs: simulation.value.logs,
        unitsConsumed: simulation.value.unitsConsumed,
      });
      const afterSimulationSnapshot = snapshotTransaction(transaction);
      logTransactionSnapshot(`${sideLabel} TRANSACTION SNAPSHOT AFTER SIMULATION`, afterSimulationSnapshot);

      if (simulation.value.err) {
        throw new Error(`${sideLabel} deposit simulation failed: ${JSON.stringify(simulation.value.err)}`);
      }

      step = "sendTransaction";
      setLockStatus(`Preparing fresh Phantom transaction. Deposit PDA: ${depositPda.toBase58()}`);
      const {
        transaction: transactionForPhantom,
        latest: phantomLatest,
      } = await buildLockTokensTransaction({
        readState: battleRead.data,
        wallet: phantom.publicKey,
        side,
        amount: DEVNET_LOCK_AMOUNT,
      });
      const beforePhantomSnapshot = snapshotTransaction(transactionForPhantom);
      const transactionComparison = compareTransactions(afterSimulationSnapshot, beforePhantomSnapshot);
      const handoffDebug = {
        sameTransactionObject: transactionForPhantom === transaction,
        simulationTransactionWasReused: false,
        phantomBuilderLatestBlockhash: phantomLatest,
        phantomFreshBlockhash: "from direct-style builder",
        preferredPhantomPath: phantom.signTransaction ? "signTransaction + sendRawTransaction" : "signAndSendTransaction",
        serializedEquality: {
          beforeSimulationVsAfterSimulation:
            beforeSimulationSnapshot.serializedBase64 === afterSimulationSnapshot.serializedBase64,
          afterFreshBlockhashVsAfterSimulation:
            afterFreshBlockhashSnapshot.transaction.serializedBase64 === afterSimulationSnapshot.serializedBase64,
          afterSimulationVsBeforePhantom:
            afterSimulationSnapshot.serializedBase64 === beforePhantomSnapshot.serializedBase64,
        },
        feePayer: beforePhantomSnapshot.feePayer,
        recentBlockhash: beforePhantomSnapshot.recentBlockhash,
        lastValidBlockHeight: beforePhantomSnapshot.lastValidBlockHeight,
        signatures: beforePhantomSnapshot.signatures,
        instructionCount: beforePhantomSnapshot.instructionCount,
        serializedLength: beforePhantomSnapshot.serializedLength,
        comparisonToLocallySimulatedTransaction: transactionComparison,
        transaction: beforePhantomSnapshot,
      };
      logTransactionSnapshot(`${sideLabel} PHANTOM HANDOFF DEBUG`, handoffDebug);
      setLockStatus(`Approve in Phantom. Deposit PDA: ${depositPda.toBase58()}`);
      let signature: string;
      try {
        if (phantom.signTransaction) {
          const signedTransaction = await phantom.signTransaction(transactionForPhantom);
          const signedSnapshot = snapshotTransaction(signedTransaction);
          console.log(`${sideLabel} SIGN RESULT`, signedTransaction);
          logTransactionSnapshot(`${sideLabel} SIGNED TRANSACTION SNAPSHOT`, signedSnapshot);
          const serializedSignedTransaction = signedTransaction.serialize();
          console.log(`${sideLabel} SEND RAW DEBUG`, {
            serializedSignedLength: serializedSignedTransaction.length,
            serializedSignedBase64: Buffer.from(serializedSignedTransaction).toString("base64"),
          });
          signature = await connection.sendRawTransaction(serializedSignedTransaction, {
            skipPreflight: false,
            preflightCommitment: "confirmed",
          });
          console.log(`${sideLabel} SEND RESULT`, { signature, path: "signTransaction + sendRawTransaction" });
        } else {
          const result = await phantom.signAndSendTransaction(transactionForPhantom);
          console.log(`${sideLabel} SEND RESULT`, { ...result, path: "signAndSendTransaction" });
          signature = result.signature;
        }
      } catch (sendError) {
        console.error(`${sideLabel} SEND ERROR`, serializeWalletError(sendError));
        throw sendError;
      }

      step = "confirmTransaction";
      setLockStatus(`Submitted. Confirming: ${signature}`);
      await connection.confirmTransaction(
        {
          signature,
          blockhash: phantomLatest.blockhash,
          lastValidBlockHeight: phantomLatest.lastValidBlockHeight,
        },
        "confirmed",
      );
      step = "refetch";
      await battleRead.refetch();
      setLockStatus(`${sideLabel} deposit confirmed: ${signature}`);
    } catch (error) {
      console.error(`${sideLabel} DEPOSIT ERROR`, {
        step,
        error,
        message: error?.message,
        stack: error?.stack,
      });
      setLockStatus(error instanceof Error ? error.message : `${sideLabel} deposit failed.`);
    } finally {
      setLockPendingSide(null);
    }
  };
  const claim = async () => {
    if (!battleRead.data || !phantom.publicKey || (!phantom.signTransaction && !phantom.signAndSendTransaction)) {
      setClaimStatus("Claim unavailable: wallet or battle state is not ready.");
      return;
    }

    setClaimPending(true);
    setClaimStatus("Preparing claim transaction...");
    let step = "start";
    try {
      step = "transaction build";
      const {
        transaction,
        latest,
        depositPda,
        deposit,
        userTokenAccount,
        vaultTokenAccount,
        instructionDiscriminator,
        accountMetas,
      } = await buildClaimTransaction({
        readState: battleRead.data,
        wallet: phantom.publicKey,
      });
      console.log("CLAIM DEBUG", {
        battlePda: battleRead.data.battlePda?.toBase58() ?? null,
        mint: battleRead.data.battle?.mint.toBase58() ?? null,
        vault: battleRead.data.battle?.vault.toBase58() ?? null,
        wallet: phantom.publicKey.toBase58(),
        userTokenAccount: userTokenAccount.toBase58(),
        vaultTokenAccount: vaultTokenAccount.toBase58(),
        depositPda: depositPda.toBase58(),
        depositSide: deposit.side,
        depositAmount: deposit.amount.toString(),
        instructionDiscriminator,
        accountMetas: accountMetas.map((meta) => ({
          pubkey: meta.pubkey.toBase58(),
          isSigner: meta.isSigner,
          isWritable: meta.isWritable,
        })),
      });
      const beforeSimulationSnapshot = snapshotTransaction(transaction);
      logTransactionSnapshot("CLAIM TRANSACTION SNAPSHOT BEFORE SIMULATION", beforeSimulationSnapshot);

      step = "simulateTransaction";
      const connection = getConnection();
      let simulation;
      try {
        simulation = await connection.simulateTransaction(transaction, undefined, false);
      } catch (simulationError) {
        console.error("CLAIM ERROR", {
          step,
          error: simulationError,
          message: simulationError?.message,
          stack: simulationError?.stack,
        });
        throw simulationError;
      }
      console.log("CLAIM SIMULATION", {
        error: simulation.value.err,
        logs: simulation.value.logs,
        unitsConsumed: simulation.value.unitsConsumed,
      });
      const afterSimulationSnapshot = snapshotTransaction(transaction);
      logTransactionSnapshot("CLAIM TRANSACTION SNAPSHOT AFTER SIMULATION", afterSimulationSnapshot);
      if (simulation.value.err) {
        throw new Error(`Claim simulation failed: ${JSON.stringify(simulation.value.err)}`);
      }

      step = "sendTransaction";
      setClaimStatus(`Approve claim in Phantom. Deposit PDA: ${depositPda.toBase58()}`);
      let signature: string;
      try {
        if (phantom.signTransaction) {
          const signedTransaction = await phantom.signTransaction(transaction);
          const signedSnapshot = snapshotTransaction(signedTransaction);
          console.log("CLAIM SIGN RESULT", signedTransaction);
          logTransactionSnapshot("CLAIM SIGNED TRANSACTION SNAPSHOT", signedSnapshot);
          const serializedSignedTransaction = signedTransaction.serialize();
          console.log("CLAIM SEND RAW DEBUG", {
            serializedSignedLength: serializedSignedTransaction.length,
            serializedSignedBase64: Buffer.from(serializedSignedTransaction).toString("base64"),
          });
          signature = await connection.sendRawTransaction(serializedSignedTransaction, {
            skipPreflight: false,
            preflightCommitment: "confirmed",
          });
          console.log("CLAIM SEND RESULT", { signature, path: "signTransaction + sendRawTransaction" });
        } else {
          const result = await phantom.signAndSendTransaction(transaction);
          console.log("CLAIM SEND RESULT", { ...result, path: "signAndSendTransaction" });
          signature = result.signature;
        }
      } catch (sendError) {
        console.error("CLAIM SEND ERROR", serializeWalletError(sendError));
        throw sendError;
      }

      step = "confirmTransaction";
      setClaimStatus(`Submitted. Confirming: ${signature}`);
      await connection.confirmTransaction(
        {
          signature,
          blockhash: latest.blockhash,
          lastValidBlockHeight: latest.lastValidBlockHeight,
        },
        "confirmed",
      );
      step = "refetch";
      await battleRead.refetch();
      setClaimStatus(`Claim confirmed: ${signature}`);
    } catch (error) {
      console.error("CLAIM ERROR", {
        step,
        error,
        message: error?.message,
        stack: error?.stack,
      });
      setClaimStatus(error instanceof Error ? error.message : "Claim failed.");
    } finally {
      setClaimPending(false);
    }
  };

  useEffect(() => {
    if (!battleRead.data && !battleRead.error) return;

    if (battleRead.error) {
      console.error("VSAI Devnet escrow read failed", battleRead.error);
      return;
    }

    const data = battleRead.data;
    console.info("VSAI Devnet escrow read", {
      wallet: phantom.address,
      configPda: data.configPda.toBase58(),
      configAccountExists: data.configRead.exists,
      configOwner: data.configRead.owner,
      configLamports: data.configRead.lamports,
      configDataLength: data.configRead.dataLength,
      configDataBase64: data.configRead.dataBase64,
      configDataHex: data.configRead.dataHex,
      configAdmin: data.config?.admin.toBase58() ?? null,
      configActiveBattleRaw: data.config?.activeBattle.toBase58() ?? null,
      configActiveBattleIsDefault: data.config?.activeBattle.equals(DEFAULT_PUBLIC_KEY) ?? null,
      activeBattlePda: data.battlePda?.toBase58() ?? null,
      battlePdaSource: data.battlePdaSource,
      battleAccountStatus: data.battle?.status ?? null,
      battleId: data.battle?.battleId.toString() ?? null,
      battleMint: data.battle?.mint.toBase58() ?? null,
      displayedMint: data.vsaiMint.toBase58(),
      mintSource: data.mintSource,
      vault: data.battle?.vault.toBase58() ?? null,
      tokenAccount: data.tokenAccount?.toBase58() ?? null,
      tokenBalance: data.tokenBalance,
      metrics: data.metrics,
      deposits: data.deposits.map((deposit) => ({
        side: deposit.side,
        pda: deposit.pda.toBase58(),
        found: Boolean(deposit.account),
        amount: deposit.account?.amount.toString() ?? null,
        claimed: deposit.account?.claimed ?? null,
      })),
      uiUsing: data.battle ? "live Devnet escrow account" : "fallback mint/demo battle display",
    });
  }, [battleRead.data, battleRead.error, phantom.address]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <ScanlineOverlay />

      {/* ====== HEADER ====== */}
      <header className="relative z-10 flex items-center justify-between gap-2 px-4 py-3.5 md:px-8 md:py-4 border-b border-matrix/15 backdrop-blur bg-black/40">
        {/* Left — Pump.fun */}
        <a
          href={PUMP_URL}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-1.5 rounded-full border border-matrix/30 bg-black/60 pl-1 pr-3 py-1 transition hover:border-matrix/70"
        >
          <img src={pumpPill.url} alt="Pump.fun" className="h-6 w-6 rounded-full object-cover" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/90 group-hover:text-matrix">
            Pump<span className="text-matrix">.fun</span>
          </span>
        </a>

        {/* Center — Buy $VSAI primary action */}
        <a
          href={buyUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition hover:opacity-90"
          style={{
            backgroundColor: "hsl(var(--matrix))",
            color: "hsl(var(--background))",
            boxShadow: "0 0 28px hsl(var(--matrix) / 0.75)",
          }}
        >
          <Zap className="h-3.5 w-3.5" strokeWidth={3} />
          <span>BUY $VSAI</span>
        </a>


        {/* Right — Phantom */}
        <div className="flex flex-col items-end gap-0.5">
          <PhantomButton wallet={wallet} onConnect={phantom.connect} />
          {wallet.status === "connected" && (
            <span className="text-[8px] md:text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-mono">
              Connected: {short(wallet.address)}
            </span>
          )}
          {phantom.error && (
            <span className="max-w-[180px] text-right text-[8px] uppercase tracking-[0.18em] text-destructive">
              {phantom.error}
            </span>
          )}
        </div>
      </header>


      {/* ====== HERO ====== */}
      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pt-5 pb-3 text-center md:pt-8">
        <h1 className="text-3xl font-black leading-[0.95] tracking-tight md:text-6xl">
          AI War is <span className="text-matrix text-glow">live</span> on-chain
        </h1>
        <p className="mt-2.5 text-xs text-muted-foreground md:text-base">
          Hold <span className="text-matrix">$VSAI</span> · Pick Tesla or GPT · One side wins every 24h
        </p>
      </section>

      {/* ====== MAIN BATTLE CARD ====== */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-6 md:px-5">
        <div className="relative overflow-hidden rounded-2xl border border-matrix/50 bg-black/80 p-4 md:p-8 backdrop-blur shadow-[0_0_60px_-20px_hsl(var(--matrix)/0.6)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-matrix to-transparent" />

          {/* Status row — prominent */}
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-matrix">
                <Swords className="h-3 w-3 animate-pulse" />
                {battleLabel}
                <span className="rounded-sm border border-matrix/40 bg-matrix/10 px-1.5 py-0.5 text-[9px]">
                  {battleStatus}
                </span>
              </p>
              <p className="mt-1 font-mono text-base md:text-xl font-black tracking-tight">
                <span className="text-muted-foreground">resolves</span>{" "}
                <BattleCountdown />
              </p>
            </div>
            <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <Clock className="h-3 w-3" />
              24h cycle
            </p>
          </div>

          {/* Side headers */}
          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-tesla">//OPTIMUS</p>
              <h3 className="mt-0.5 text-base font-black md:text-2xl text-tesla">Tesla Bot</h3>
              <p className="mt-0.5 font-mono text-3xl md:text-5xl font-black text-tesla leading-none">
                {formatPct(teslaPowerPct)}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-[0.3em] text-gpt">//OMNI</p>
              <h3 className="mt-0.5 text-base font-black md:text-2xl text-gpt">GPT Bot</h3>
              <p className="mt-0.5 font-mono text-3xl md:text-5xl font-black text-gpt leading-none">
                {formatPct(gptPowerPct)}%
              </p>
            </div>
          </div>

          {/* Battle Power Bar */}
          <div className="relative h-12 md:h-16 w-full overflow-hidden rounded-xl border border-matrix/30 bg-white/5">
            <div
              className="absolute inset-y-0 left-0 bg-tesla"
              style={{ width: `${teslaPowerPct}%`, boxShadow: "0 0 24px hsl(var(--tesla))" }}
            />
            <div
              className="absolute inset-y-0 right-0 bg-gpt"
              style={{ width: `${gptPowerPct}%`, boxShadow: "0 0 24px hsl(var(--gpt))" }}
            />
            <div className="absolute inset-y-0 left-1/2 w-px bg-background/70" />
            <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-background/90">
              <span>{formatTokenAmount(teslaCommitted)} $VSAI</span>
              <span>{formatTokenAmount(gptCommitted)} $VSAI</span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.25em]">
            <span className="text-tesla">Tesla committed</span>
            <span className="flex items-center gap-1.5 text-matrix">
              <Trophy className="h-3 w-3" />
              leader · {leaderLabel}
            </span>
            <span className="text-gpt">GPT committed</span>
          </div>
          <p className="mt-2 text-center text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
            metrics · {metricsSource}
          </p>

          {/* ====== ACTION STATES ====== */}
          <div className="mt-6">
            <ActionPanel
              wallet={wallet}
              onConnect={phantom.connect}
              onPick={pick}
              onClaim={claim}
              buyUrl={buyUrl}
              loading={battleRead.isLoading}
              canLockTesla={canLockSide}
              canLockGpt={canLockSide}
              lockPendingSide={lockPendingSide}
              lockStatus={lockStatus}
              canClaim={canClaim}
              claimPending={claimPending}
              claimStatus={claimStatus}
            />
          </div>

          {/* Stats — protocol grid (always visible) + position when connected */}
          <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Stat label="Pool Size" value={`${formatTokenAmount(poolSize)} $VSAI`} />
            <Stat label="SOL Locked" value={formatSol(metrics?.solLocked ?? null)} />
            <Stat label="Metric Source" value={metricsSource} />
            <CAStat ca={displayVsaiCa} />
          </div>
          {wallet.status === "connected" && "position" in wallet && wallet.position ? (
            <YourPositionStats position={wallet.position} />
          ) : null}
          <DevnetEscrowReadout
            readState={battleRead.data}
            walletAddress={phantom.address}
            loading={battleRead.isLoading}
            error={battleRead.error}
          />
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <Section eyebrow="// how it works" title="Connect · Pick · Claim · Repeat">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
          <Step icon={Plug} label="Connect Phantom" />
          <Step icon={Target} label="Pick Tesla or GPT" />
          <Step icon={Lock} label="Lock $VSAI" />
          <Step icon={Swords} label="Battle Resolves" />
          <Step icon={Gift} label="Claim + Rewards" />
          <Step icon={Repeat} label="Repeat" />
        </div>
      </Section>

      {/* ====== BATTLE ARENAS ====== */}
      <Section eyebrow="// battle arenas" title="Battle Arenas">
        <div className="grid gap-3 md:grid-cols-3">
          {arenas.map((t) => (
            <ArenaCard key={t.title} {...t} />
          ))}
        </div>
        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          follow{" "}
          <a href={X_URL} target="_blank" rel="noreferrer" className="text-matrix hover:opacity-80">
            X ↗
          </a>{" "}
          for intelligence updates, battle reports, and transmission releases
        </p>
      </Section>

      <footer className="relative z-10 border-t border-matrix/10 px-5 py-8 md:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            <a href={PUMP_URL} target="_blank" rel="noreferrer" className="hover:text-matrix transition">
              Pump.fun ↗
            </a>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-matrix transition">
              Telegram ↗
            </a>
            <a href={X_URL} target="_blank" rel="noreferrer" className="hover:text-matrix transition">
              X ↗
            </a>
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
            <span className="text-matrix">$VSAI</span> · escrow engine live on-chain
          </p>
        </div>
      </footer>
    </main>
  );
};

/* ---------- Devnet Readout ---------- */

const DevnetEscrowReadout = ({
  readState,
  walletAddress,
  loading,
  error,
}: {
  readState?: EscrowReadState;
  walletAddress: string | null;
  loading: boolean;
  error: unknown;
}) => {
  const [expanded, setExpanded] = useState(false);
  const battle = readState?.battle;
  const rows = [
    ["RPC read", loading ? "loading" : error ? "failed" : "succeeded"],
    ["Connected wallet", walletAddress ?? "not connected"],
    ["Config PDA", readState?.configPda.toBase58() ?? "not read yet"],
    ["Config account exists", readState ? (readState.configRead.exists ? "yes" : "no") : "not read yet"],
    ["Config owner", readState?.configRead.owner ?? "not read yet"],
    ["Config data length", readState ? `${readState.configRead.dataLength} bytes` : "not read yet"],
    ["Config admin", readState?.config?.admin.toBase58() ?? "not decoded"],
    ["Config active_battle raw", readState?.config?.activeBattle.toBase58() ?? "not decoded"],
    [
      "Config active_battle is default",
      readState?.config ? (readState.config.activeBattle.equals(DEFAULT_PUBLIC_KEY) ? "yes" : "no") : "not decoded",
    ],
    ["Active battle PDA", readState?.battlePda?.toBase58() ?? "none"],
    ["Battle PDA source", readState?.battlePdaSource ?? "not read yet"],
    ["Battle account status", battle ? battle.status : readState?.battlePda ? "missing account" : "none"],
    ["Battle mint", battle?.mint.toBase58() ?? readState?.vsaiMint.toBase58() ?? "not read yet"],
    ["Mint source", readState?.mintSource ?? "not read yet"],
    ["Vault", battle?.vault.toBase58() ?? "not available"],
    ["Wallet token account", readState?.tokenAccount?.toBase58() ?? (walletAddress ? "missing or unread" : "not connected")],
    ["Wallet $VSAI balance", readState ? readState.tokenBalance.toLocaleString("en-US") : "not read yet"],
    ["Battle deposit accounts", readState ? `${readState.battleDeposits.length}` : "not read yet"],
    ["Vault token balance", readState?.metrics.vaultAmount === null || !readState ? "not available" : `${formatTokenAmount(readState.metrics.vaultAmount)} $VSAI`],
    ["Tesla committed live", readState ? `${formatTokenAmount(readState.metrics.teslaAmount)} $VSAI` : "not read yet"],
    ["GPT committed live", readState ? `${formatTokenAmount(readState.metrics.gptAmount)} $VSAI` : "not read yet"],
    ["Battle power live", readState ? `${formatPct(readState.metrics.teslaPct)}% / ${formatPct(readState.metrics.gptPct)}%` : "not read yet"],
    [
      "SOL locked source",
      readState
        ? readState.metrics.solLocked === null
          ? "not priced; set VITE_VSAI_SOL_PRICE to estimate"
          : `${formatSol(readState.metrics.solLocked)} from VITE_VSAI_SOL_PRICE`
        : "not read yet",
    ],
    [
      "UI data source",
      battle ? "live Devnet escrow account" : readState ? "fallback mint/demo battle display" : "not read yet",
    ],
  ];

  return (
    <div className="mt-5 flex justify-center">
      <div className="w-full max-w-4xl rounded-xl border border-matrix/15 bg-black/35">
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className="flex w-full items-center justify-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground transition hover:text-matrix"
        >
          <Database className="h-3.5 w-3.5" />
          {expanded ? "Hide Developer Diagnostics" : "Show Developer Diagnostics"}
        </button>
        {expanded ? (
          <div className="border-t border-matrix/15 p-3 md:p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-matrix">Developer Diagnostics</p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                Internal escrow account readout
              </p>
            </div>
            {error ? (
              <p className="mt-2 break-words rounded-lg border border-destructive/30 bg-destructive/10 p-2 font-mono text-[10px] text-destructive">
                {error instanceof Error ? error.message : "Read failed"}
              </p>
            ) : null}
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {rows.map(([label, value]) => (
                <ReadoutRow key={label} label={label} value={value} />
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-white/5 bg-black/40 p-2">
              <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Exact config data returned</p>
              <p className="mt-1 break-all font-mono text-[10px] text-foreground">
                base64: {readState?.configRead.dataBase64 ?? "not read yet"}
              </p>
              <p className="mt-1 break-all font-mono text-[10px] text-muted-foreground">
                hex: {readState?.configRead.dataHex ?? "not read yet"}
              </p>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {(["tesla", "gpt"] as const).map((side) => {
                const deposit = readState?.deposits.find((entry) => entry.side === side);
                return (
                  <div key={side} className="rounded-lg border border-white/5 bg-black/40 p-2">
                    <p className={`text-[9px] uppercase tracking-[0.25em] ${side === "tesla" ? "text-tesla" : "text-gpt"}`}>
                      {side} deposit read
                    </p>
                    <p className="mt-1 break-all font-mono text-[10px] text-muted-foreground">
                      PDA: {deposit?.pda.toBase58() ?? (walletAddress && readState?.battlePda ? "deriving..." : "not read")}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-foreground">
                      {deposit?.account
                        ? `found · amount ${deposit.account.amount.toString()} · claimed ${deposit.account.claimed ? "yes" : "no"}`
                        : deposit
                          ? "no deposit account found"
                          : "not read"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const ReadoutRow = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-white/5 bg-black/40 p-2">
    <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
    <p className="mt-1 break-all font-mono text-[10px] text-foreground">{value}</p>
  </div>
);

/* ---------- Phantom Button ---------- */

const PhantomButton = ({ wallet, onConnect }: { wallet: WalletState; onConnect: () => void | Promise<void> }) => {
  if (wallet.status === "disconnected") {
    return (
      <button
        onClick={onConnect}
        className="group flex items-center gap-1.5 rounded-full bg-[#AB9FF2] pl-1 pr-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1033] transition hover:opacity-90"
        style={{ boxShadow: "0 0 18px rgba(171,159,242,0.45)" }}
      >
        <img src={phantomGhost.url} alt="Phantom" className="h-6 w-6 rounded-full object-cover" />
        Connect Phantom
      </button>
    );
  }
  return (
    <div
      className="flex items-center gap-1.5 rounded-full bg-[#AB9FF2]/20 border border-[#AB9FF2]/50 pl-1 pr-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#AB9FF2]"
    >
      <img src={phantomGhost.url} alt="Phantom" className="h-6 w-6 rounded-full object-cover" />
      <span className="hidden sm:inline">{short(wallet.address)}</span>
      <span className="sm:hidden">Connected</span>
    </div>
  );
};

/* ---------- Action Panel ---------- */

const ActionPanel = ({
  wallet,
  onConnect,
  onPick,
  onClaim,
  buyUrl,
  loading,
  canLockTesla,
  canLockGpt,
  lockPendingSide,
  lockStatus,
  canClaim,
  claimPending,
  claimStatus,
}: {
  wallet: WalletState;
  onConnect: () => void | Promise<void>;
  onPick: (s: "tesla" | "gpt") => void | Promise<void>;
  onClaim: () => void;
  buyUrl: string;
  loading?: boolean;
  canLockTesla: boolean;
  canLockGpt: boolean;
  lockPendingSide: "tesla" | "gpt" | null;
  lockStatus: string | null;
  canClaim: boolean;
  claimPending: boolean;
  claimStatus: string | null;
}) => {
  const formatVsai = (amount: number) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(amount);

  // 1) Disconnected → big Connect Phantom
  if (wallet.status === "disconnected") {
    return (
      <button
        onClick={onConnect}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#AB9FF2] py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#1a1033] hover:opacity-90"
        style={{ boxShadow: "0 0 28px rgba(171,159,242,0.55)" }}
      >
        <img src={phantomGhost.url} alt="" className="h-6 w-6 rounded-full object-cover" />
        Connect to Pick Your Side
      </button>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-matrix/30 bg-black/50 p-4 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-matrix">
          Reading Devnet Battle State
        </p>
      </div>
    );
  }

  // 4) Claim available
  if ("claim" in wallet) {
    const { claim } = wallet;
    return (
      <div className="rounded-xl border-2 border-matrix bg-matrix/10 p-4 md:p-5 animate-pulse-slow">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-matrix">
          <span className="flex items-center gap-1.5">
            <Gift className="h-3.5 w-3.5" /> claim available
          </span>
          <span>{claim.battleId ? `battle #${claim.battleId} resolved` : "battle resolved"}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-center md:grid-cols-3">
          <MiniStat label="Side" value={claim.side.toUpperCase()} accent={claim.side} />
          <MiniStat label="Principal" value={`${formatVsai(claim.principal)} $VSAI`} />
          <MiniStat label="Bonus" value={`+${formatVsai(claim.bonus)} $VSAI`} accent="matrix" />
        </div>
        <Button
          onClick={onClaim}
          disabled={!canClaim}
          className="mt-4 h-14 w-full text-base font-bold uppercase tracking-[0.2em] text-background"
          style={{ backgroundColor: "hsl(var(--matrix))", boxShadow: "0 0 28px hsl(var(--matrix)/0.6)" }}
        >
          <Gift className="mr-2 h-5 w-5" /> {claimPending ? "Claiming..." : "Claim Tokens + Rewards"}
        </Button>
        {claimStatus ? (
          <p className="mt-3 break-words rounded-lg border border-matrix/30 bg-black/40 p-2 font-mono text-[10px] text-matrix">
            {claimStatus}
          </p>
        ) : null}
      </div>
    );
  }

  // 3) Active position
  if (wallet.position) {
    const p = wallet.position;
    const accent = p.side === "tesla" ? "tesla" : "gpt";
    return (
      <div
        className={`rounded-xl border bg-black/50 p-4 md:p-5 ${
          accent === "tesla" ? "border-tesla/50" : "border-gpt/50"
        }`}
      >
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em]">
          <span className={`flex items-center gap-1.5 ${accent === "tesla" ? "text-tesla" : "text-gpt"}`}>
            <Lock className="h-3.5 w-3.5" /> position active
          </span>
          <span className="text-muted-foreground">
            resolves <span className="font-mono text-matrix">in {p.timeRemaining}</span>
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
          <MiniStat label="Side" value={p.side.toUpperCase()} accent={accent} />
          <MiniStat label="Locked" value={`${formatVsai(p.amount)} $VSAI`} />
          <MiniStat label="≈ SOL" value={`◎ ${p.sol}`} />
          <MiniStat label="≈ USD" value={`$${p.usd}`} />
        </div>
        <div className="mt-3 flex items-center justify-end">
          <button
            onClick={onClaim}
            disabled
            className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-matrix"
          >
            claim enabled in phase 2 →
          </button>
        </div>
      </div>
    );
  }

  // 2a) Connected but no $VSAI balance → push to buy
  if (wallet.balance <= 0) {
    return (
      <a
        href={buyUrl}
        target="_blank"
        rel="noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-matrix py-4 text-sm font-bold uppercase tracking-[0.2em] text-background hover:opacity-90"
        style={{ boxShadow: "0 0 28px hsl(var(--matrix) / 0.6)" }}
      >
        <ShoppingCart className="h-5 w-5" />
        Buy $VSAI to Enter the Battle
      </a>
    );
  }

  // 2b) Connected, no position
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <Button
          onClick={() => onPick("tesla")}
          disabled={!canLockTesla}
          title={
            canLockTesla
              ? "Devnet test only: lock 1 fake $VSAI on Tesla."
              : "Tesla deposit needs an active Devnet battle, connected Phantom, and at least 1 fake $VSAI."
          }
          className="h-14 bg-tesla text-background hover:bg-tesla/90 font-bold uppercase tracking-[0.2em] border-0 text-sm disabled:cursor-not-allowed disabled:opacity-45"
          style={{ boxShadow: canLockTesla ? "0 0 24px hsl(var(--tesla) / 0.55)" : "none" }}
        >
          {lockPendingSide === "tesla" ? "Locking Tesla..." : "Lock 1 $VSAI on Tesla"}
        </Button>
        <Button
          onClick={() => onPick("gpt")}
          disabled={!canLockGpt}
          title={
            canLockGpt
              ? "Devnet test only: lock 1 fake $VSAI on GPT."
              : "GPT deposit needs an active Devnet battle, connected Phantom, and at least 1 fake $VSAI."
          }
          className="h-14 bg-gpt text-background hover:bg-gpt/90 font-bold uppercase tracking-[0.2em] border-0 text-sm disabled:cursor-not-allowed disabled:opacity-45"
          style={{ boxShadow: canLockGpt ? "0 0 24px hsl(var(--gpt) / 0.55)" : "none" }}
        >
          {lockPendingSide === "gpt" ? "Locking GPT..." : "Lock 1 $VSAI on GPT"}
        </Button>
      </div>
      {lockStatus ? (
        <p className="break-words rounded-lg border border-tesla/30 bg-tesla/10 p-2 font-mono text-[10px] text-tesla">
          {lockStatus}
        </p>
      ) : null}
    </div>
  );
};

const MiniStat = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "tesla" | "gpt" | "matrix";
}) => (
  <div className="rounded-lg border border-white/5 bg-black/40 p-2">
    <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
    <p
      className={`mt-0.5 font-mono text-sm font-bold ${
        accent === "tesla" ? "text-tesla" : accent === "gpt" ? "text-gpt" : accent === "matrix" ? "text-matrix" : ""
      }`}
    >
      {value}
    </p>
  </div>
);

/* ---------- Shared subcomponents ---------- */

const Section = ({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="relative z-10 mx-auto max-w-6xl px-4 py-7 md:px-5 md:py-10">
    <div className="mb-4">
      <p className="text-[10px] uppercase tracking-[0.35em] text-matrix">{eyebrow}</p>
      <h2 className="mt-1 text-lg font-black tracking-tight md:text-2xl">{title}</h2>
    </div>
    {children}
  </section>
);

const Step = ({ icon: Icon, label }: { icon: typeof Plug; label: string }) => (
  <div className="rounded-xl border border-matrix/15 bg-black/40 p-3 text-center">
    <Icon className="mx-auto h-4 w-4 text-matrix" />
    <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.15em]">{label}</p>
  </div>
);

const Stat = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="rounded-lg border border-matrix/10 bg-black/40 p-2.5">
    <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
    <p className={`mt-0.5 font-mono text-sm font-bold md:text-base ${highlight ? "text-matrix text-glow" : ""}`}>
      {value}
    </p>
  </div>
);

const CAStat = ({ ca }: { ca: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ca);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="group flex flex-col rounded-lg border border-matrix/30 bg-black/40 p-2.5 text-left transition hover:border-matrix/70 hover:bg-matrix/5"
    >
      <span className="flex items-center justify-between text-[9px] uppercase tracking-[0.25em] text-muted-foreground transition group-hover:text-matrix">
        {copied ? (
          <span className="flex items-center gap-1 text-matrix">
            COPIED <Check className="h-3 w-3" />
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <span className="group-hover:hidden">COPY $VSAI CA</span>
            <span className="hidden group-hover:inline">Click to Copy</span>
          </span>
        )}
        {copied ? (
          <Check className="h-3 w-3 text-matrix" />
        ) : (
          <Copy className="h-3 w-3 text-matrix opacity-70 group-hover:opacity-100" />
        )}
      </span>
      <span className="mt-0.5 truncate font-mono text-sm font-bold text-matrix">
        {ca.slice(0, 4)}…{ca.slice(-4)}
      </span>
    </button>
  );
};

const ScanlineOverlay = () => (
  <div
    className="pointer-events-none absolute inset-0 z-[1] opacity-[0.06]"
    style={{
      backgroundImage:
        "repeating-linear-gradient(0deg, hsl(var(--matrix)) 0px, hsl(var(--matrix)) 1px, transparent 1px, transparent 3px)",
    }}
  />
);

const BattleCountdown = () => {
  const [label, setLabel] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setUTCHours(24, 0, 0, 0);
      const d = end.getTime() - now.getTime();
      const h = Math.floor(d / 3.6e6);
      const m = Math.floor((d % 3.6e6) / 6e4);
      const s = Math.floor((d % 6e4) / 1000);
      setLabel(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono text-matrix">in {label}</span>;
};

/* ---------- Your Position Stats (replaces protocol stats when connected) ---------- */

const YourPositionStats = ({
  position,
}: {
  position: { side: "tesla" | "gpt"; amount: number; sol: number; usd: number; timeRemaining: string };
}) => {
  const accent = position.side;
  const amount = new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(position.amount);
  return (
    <div className="mt-5 rounded-xl border border-matrix/20 bg-black/50 p-3 md:p-4">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em]">
        <span className={`flex items-center gap-1.5 text-${accent}`}>
          <Lock className="h-3 w-3" /> your position
        </span>
        <span className="text-muted-foreground">status · locked</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-6">
        <MiniStat label="Side" value={position.side.toUpperCase()} accent={accent} />
        <MiniStat label="Locked" value={amount} />
        <MiniStat label="≈ SOL" value={`◎ ${position.sol}`} />
        <MiniStat label="≈ USD" value={`$${position.usd}`} />
        <MiniStat label="Status" value="LOCKED" accent="matrix" />
        <div className="rounded-lg border border-white/5 bg-black/40 p-2">
          <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Time</p>
          <p className="mt-0.5 font-mono text-sm font-bold text-matrix">{position.timeRemaining}</p>
        </div>
      </div>
    </div>
  );
};

/* ---------- Battle Arenas ---------- */

const arenas = [
  { icon: Database, code: "ARN-01", title: "Quantum Vault", status: "online", src: txSecurity.url },
  { icon: Radio, code: "ARN-02", title: "Orbital Relay", status: "broadcasting", src: txBreach.url },
  { icon: Rocket, code: "ARN-03", title: "Mars Launch Facility", status: "armed", src: txIncoming.url },
];

const ArenaCard = ({
  icon: Icon,
  code,
  title,
  status,
  src,
}: {
  icon: typeof Video;
  code: string;
  title: string;
  status: string;
  src: string;
}) => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play();
    setPlaying(true);
  };

  return (
    <div className="group relative block overflow-hidden rounded-xl border border-matrix/20 bg-black/60 backdrop-blur transition hover:border-matrix/60">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={src}
          preload="metadata"
          playsInline
          controls={playing}
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {!playing && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label={`Play ${title}`}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-matrix/10 via-transparent to-black/60" />
            <div className="absolute inset-0 grid-bg opacity-20" />
            <PlayCircle
              className="relative h-12 w-12 text-matrix opacity-90 transition group-hover:scale-110"
              style={{ filter: "drop-shadow(0 0 12px hsl(var(--matrix)))" }}
            />
            <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full border border-matrix/30 bg-black/70 px-2 py-0.5 text-[9px] uppercase tracking-[0.25em] text-matrix">
              <span className="h-1 w-1 animate-pulse rounded-full bg-matrix" />
              {status}
            </div>
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 p-3">
        <Icon className="h-3.5 w-3.5 text-matrix shrink-0" />
        <div className="min-w-0">
          <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{code}</p>
          <p className="truncate text-xs font-bold">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
