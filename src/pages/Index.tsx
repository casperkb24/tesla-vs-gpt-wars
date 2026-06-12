import { useEffect, useState, useRef } from "react";
import {
  Terminal,
  Radio,
  Shield,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import txSecurity from "@/assets/tx-security.mp4.asset.json";
import txBreach from "@/assets/tx-breach.mov.asset.json";
import txIncoming from "@/assets/tx-incoming.mp4.asset.json";
import pumpPill from "@/assets/pump-pill.asset.json";
import phantomGhost from "@/assets/phantom-ghost.asset.json";

const TELEGRAM_URL = "https://t.me/AI_war_casperKObe24";
const X_URL = "https://x.com/casperkobe24?s=21";
const PUMP_URL = "https://pump.fun";


/* ---------- Live mock numbers ---------- */
const TESLA_POWER_PCT = 47.3;
const GPT_POWER_PCT = 52.7;
const TESLA_SUPPLY = 42_730_000;
const GPT_SUPPLY = 47_620_000;
const SOL_VALUE = 184.6;
const USD_VALUE = 31_420;

type WalletState =
  | { status: "disconnected" }
  | { status: "connected"; address: string; position: null }
  | {
      status: "connected";
      address: string;
      position: { side: "tesla" | "gpt"; amount: number; sol: number; usd: number };
    }
  | {
      status: "connected";
      address: string;
      claim: { side: "tesla" | "gpt"; principal: number; bonus: number };
    };

const short = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`;

const Index = () => {
  // Demo wallet — cycles through states so the UI is reviewable.
  const [wallet, setWallet] = useState<WalletState>({ status: "disconnected" });

  const connect = () =>
    setWallet({
      status: "connected",
      address: "7xKXtg2CW8Df4Hk9JpQ1mZbN3vRuLs6yPqA8oE5dF1nB",
      position: null,
    });

  const pick = (side: "tesla" | "gpt") =>
    setWallet((w) =>
      w.status === "connected"
        ? {
            status: "connected",
            address: w.address,
            position: { side, amount: 250_000, sol: 0.42, usd: 78 },
          }
        : w,
    );

  const simulateClaim = () =>
    setWallet((w) =>
      w.status === "connected"
        ? {
            status: "connected",
            address: w.address,
            claim: { side: "gpt", principal: 250_000, bonus: 38_500 },
          }
        : w,
    );

  const reset = () => setWallet({ status: "disconnected" });

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

        {/* Center — branding */}
        <div className="flex items-center gap-1.5 font-black tracking-tight">
          <Terminal className="h-4 w-4 text-matrix" />
          <span className="text-matrix text-glow text-sm md:text-base">$VSAI</span>
        </div>

        {/* Right — Phantom */}
        <div className="flex flex-col items-end gap-0.5">
          <PhantomButton wallet={wallet} onConnect={connect} />
          {wallet.status === "connected" && (
            <span className="text-[8px] md:text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-mono">
              Connected: {short(wallet.address)}
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

          {/* Status row */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-[0.25em]">
            <span className="flex items-center gap-2 text-matrix">
              <Swords className="h-3 w-3 animate-pulse" />
              battle #047
              <span className="rounded-sm border border-matrix/40 bg-matrix/10 px-1.5 py-0.5 text-[9px]">
                in progress
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3 w-3" />
              resolves <BattleCountdown />
            </span>
          </div>

          {/* Side headers */}
          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-tesla">//OPTIMUS</p>
              <h3 className="mt-0.5 text-base font-black md:text-2xl text-tesla">Tesla Bot</h3>
              <p className="mt-0.5 font-mono text-3xl md:text-5xl font-black text-tesla leading-none">
                {TESLA_POWER_PCT}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-[0.3em] text-gpt">//OMNI</p>
              <h3 className="mt-0.5 text-base font-black md:text-2xl text-gpt">GPT Bot</h3>
              <p className="mt-0.5 font-mono text-3xl md:text-5xl font-black text-gpt leading-none">
                {GPT_POWER_PCT}%
              </p>
            </div>
          </div>

          {/* Battle Power Bar */}
          <div className="relative h-12 md:h-16 w-full overflow-hidden rounded-xl border border-matrix/30 bg-white/5">
            <div
              className="absolute inset-y-0 left-0 bg-tesla"
              style={{ width: `${TESLA_POWER_PCT}%`, boxShadow: "0 0 24px hsl(var(--tesla))" }}
            />
            <div
              className="absolute inset-y-0 right-0 bg-gpt"
              style={{ width: `${GPT_POWER_PCT}%`, boxShadow: "0 0 24px hsl(var(--gpt))" }}
            />
            <div className="absolute inset-y-0 left-1/2 w-px bg-background/70" />
            <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-background/90">
              <span>{(TESLA_SUPPLY / 1_000_000).toFixed(2)}M</span>
              <span>{(GPT_SUPPLY / 1_000_000).toFixed(2)}M</span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.25em]">
            <span className="text-tesla">Tesla committed</span>
            <span className="flex items-center gap-1.5 text-matrix">
              <Trophy className="h-3 w-3" />
              leader · {GPT_POWER_PCT > TESLA_POWER_PCT ? "GPT" : "TESLA"}
            </span>
            <span className="text-gpt">GPT committed</span>
          </div>

          {/* ====== ACTION STATES ====== */}
          <div className="mt-6">
            <ActionPanel wallet={wallet} onConnect={connect} onPick={pick} onClaimDemo={simulateClaim} onReset={reset} />
          </div>

          {/* Stats — protocol when disconnected, position when connected */}
          {wallet.status === "disconnected" ? (
            <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
              <Stat label="Pool Size" value={`${((TESLA_SUPPLY + GPT_SUPPLY) / 1_000_000).toFixed(1)}M`} />
              <Stat label="≈ SOL" value={`◎ ${SOL_VALUE.toFixed(1)}`} />
              <Stat label="≈ USD" value={`$${(USD_VALUE / 1000).toFixed(1)}K`} />
              <Stat label="Last Winner" value="GPT" highlight />
            </div>
          ) : "position" in wallet && wallet.position ? (
            <YourPositionStats position={wallet.position} />
          ) : null}
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

/* ---------- Phantom Button ---------- */

const PhantomButton = ({ wallet, onConnect }: { wallet: WalletState; onConnect: () => void }) => {
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
  onClaimDemo,
  onReset,
}: {
  wallet: WalletState;
  onConnect: () => void;
  onPick: (s: "tesla" | "gpt") => void;
  onClaimDemo: () => void;
  onReset: () => void;
}) => {
  // 1) Disconnected → big Connect Phantom
  if (wallet.status === "disconnected") {
    return (
      <button
        onClick={onConnect}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#AB9FF2] py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#1a1033] hover:opacity-90"
        style={{ boxShadow: "0 0 28px rgba(171,159,242,0.55)" }}
      >
        <img src={phantomGhost.url} alt="" className="h-6 w-6 rounded-full object-cover" />
        Connect Phantom to Participate
      </button>
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
          <span>battle #046 resolved</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-center md:grid-cols-3">
          <MiniStat label="Side" value={claim.side.toUpperCase()} accent={claim.side} />
          <MiniStat label="Principal" value={`${(claim.principal / 1000).toFixed(0)}K`} />
          <MiniStat label="Bonus" value={`+${(claim.bonus / 1000).toFixed(1)}K`} accent="matrix" />
        </div>
        <Button
          onClick={onReset}
          className="mt-4 h-14 w-full text-base font-bold uppercase tracking-[0.2em] text-background"
          style={{ backgroundColor: "hsl(var(--matrix))", boxShadow: "0 0 28px hsl(var(--matrix)/0.6)" }}
        >
          <Gift className="mr-2 h-5 w-5" /> Claim Tokens + Rewards
        </Button>
      </div>
    );
  }

  // 3) Active position
  if (wallet.position) {
    const p = wallet.position;
    const accent = p.side === "tesla" ? "tesla" : "gpt";
    return (
      <div className={`rounded-xl border bg-black/50 p-4 md:p-5 border-${accent}/50`}>
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em]">
          <span className={`flex items-center gap-1.5 text-${accent}`}>
            <Lock className="h-3.5 w-3.5" /> your position
          </span>
          <span className="text-muted-foreground">
            resolves <BattleCountdown />
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
          <MiniStat label="Side" value={p.side.toUpperCase()} accent={accent} />
          <MiniStat label="Locked" value={`${(p.amount / 1000).toFixed(0)}K $VSAI`} />
          <MiniStat label="≈ SOL" value={`◎ ${p.sol}`} />
          <MiniStat label="≈ USD" value={`$${p.usd}`} />
        </div>
        <div className="mt-3 flex items-center justify-end">
          <button
            onClick={onClaimDemo}
            className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-matrix"
          >
            simulate resolution →
          </button>
        </div>
      </div>
    );
  }

  // 2) Connected, no position
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Button
        onClick={() => onPick("tesla")}
        className="h-14 bg-tesla text-background hover:bg-tesla/90 font-bold uppercase tracking-[0.2em] border-0 text-sm"
        style={{ boxShadow: "0 0 24px hsl(var(--tesla) / 0.55)" }}
      >
        Pick Tesla Bot
      </Button>
      <Button
        onClick={() => onPick("gpt")}
        className="h-14 bg-gpt text-background hover:bg-gpt/90 font-bold uppercase tracking-[0.2em] border-0 text-sm"
        style={{ boxShadow: "0 0 24px hsl(var(--gpt) / 0.55)" }}
      >
        Pick GPT Bot
      </Button>
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

/* ---------- Vault ---------- */

const vaultEvents = [
  { icon: Flame, name: "Reserve Burn Event", code: "VLT-01", detail: "120K $VSAI", sub: "scheduled · this week" },
  { icon: Coins, name: "Reserve Purchase Event", code: "VLT-02", detail: "◎ 8.5 SOL", sub: "allocated · pending execution" },
  { icon: Gift, name: "Participant Reward Event", code: "VLT-03", detail: "75K $VSAI", sub: "distributed · last 24h" },
];

const VaultEventCard = ({
  icon: Icon,
  name,
  code,
  detail,
  sub,
}: {
  icon: typeof Flame;
  name: string;
  code: string;
  detail: string;
  sub: string;
}) => (
  <div className="rounded-xl border border-matrix/20 bg-card/40 p-4 backdrop-blur transition hover:border-matrix/50">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-matrix" />
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{code}</p>
          <h3 className="mt-0.5 text-sm font-bold">{name}</h3>
        </div>
      </div>
      <span className="flex items-center gap-1 text-matrix text-[10px] uppercase tracking-[0.2em]">
        <Coins className="h-3 w-3" />
        <span className="font-mono">{detail}</span>
      </span>
    </div>
    <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{sub}</p>
  </div>
);

/* ---------- Milestones ---------- */

const milestones = [
  { icon: Users, label: "Holders", current: "1,842", target: "5,000", progress: 37 },
  { icon: Activity, label: "24h Volume", current: "$182K", target: "$500K", progress: 36 },
  { icon: TrendingUp, label: "Market Cap", current: "$1.2M", target: "$5M", progress: 24 },
  { icon: Flame, label: "X Engagement", current: "412K", target: "1M", progress: 41 },
];

const MilestoneRow = ({
  icon: Icon,
  label,
  current,
  target,
  progress,
}: {
  icon: typeof Users;
  label: string;
  current: string;
  target: string;
  progress: number;
}) => (
  <div className="rounded-xl border border-matrix/20 bg-card/40 p-3.5 backdrop-blur">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-matrix" />
        <span className="text-xs uppercase tracking-[0.25em]">{label}</span>
      </div>
      <span className="font-mono text-xs text-muted-foreground">
        <span className="text-matrix">{current}</span> / {target}
      </span>
    </div>
    <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
      <div
        className="h-full bg-gradient-to-r from-matrix to-matrix/70"
        style={{ width: `${progress}%`, boxShadow: "0 0 10px hsl(var(--matrix))" }}
      />
    </div>
  </div>
);

/* ---------- Transmissions ---------- */

const transmissions = [
  { icon: Video, code: "TX-019", title: "Recovered Security Footage", status: "decrypted", src: txSecurity.url },
  { icon: Shield, code: "TX-020", title: "Facility Breach Confirmed", status: "released", src: txBreach.url },
  { icon: Radio, code: "TX-021", title: "Transmission Incoming", status: "incoming", src: txIncoming.url },
];

const TransmissionCard = ({
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
