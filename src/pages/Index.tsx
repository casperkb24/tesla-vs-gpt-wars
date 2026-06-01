import { useEffect, useRef, useState } from "react";
import {
  Terminal,
  Radio,
  Shield,
  Swords,
  Clock,
  Lock,
  Flame,
  Coins,
  TrendingUp,
  Activity,
  Users,
  ShoppingCart,
  RotateCw,
  Gift,
  Video,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import txSecurity from "@/assets/tx-security.mp4.asset.json";
import txBreach from "@/assets/tx-breach.mov.asset.json";
import txIncoming from "@/assets/tx-incoming.mp4.asset.json";

const TELEGRAM_URL = "https://t.me/AI_war_casperKObe24";
const X_URL = "https://x.com/casperkobe24?s=21";
const SITE_URL = "https://tesla-vs-gpt-wars.lovable.app";
const BUY_URL = TELEGRAM_URL; // placeholder until CA drops

/* ---------- Live mock numbers ---------- */
const TESLA_POWER_PCT = 47.3;
const GPT_POWER_PCT = 52.7;
const TESLA_SUPPLY = 42_730_000;
const GPT_SUPPLY = 47_620_000;
const SOL_VALUE = 184.6;
const USD_VALUE = 31_420;

const Index = () => {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <ScanlineOverlay />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-5 py-5 md:px-10">
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <Terminal className="h-5 w-5 text-matrix" />
          <span className="text-matrix text-glow">$VSAI</span>
        </div>
        <div className="hidden md:flex items-center gap-5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <span className="flex items-center gap-2 text-matrix">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-matrix" />
            battle #047 live
          </span>
          <span>resolves in <BattleCountdown /></span>
        </div>
        <Button
          asChild
          size="sm"
          className="h-9 px-4 font-bold uppercase tracking-[0.2em] text-background hover:opacity-90"
          style={{ backgroundColor: "hsl(var(--matrix))" }}
        >
          <a href={BUY_URL} target="_blank" rel="noreferrer">
            <ShoppingCart className="mr-1.5 h-4 w-4" />
            Buy $VSAI
          </a>
        </Button>
      </header>

      {/* Hero — minimal */}
      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pt-4 pb-6 text-center md:pt-8">
        <h1 className="text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">
          AI War is <span className="text-matrix text-glow">live</span> on-chain
        </h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          Hold <span className="text-matrix">$VSAI</span> · Pick Tesla or GPT · One side wins every 24h
        </p>
      </section>

      {/* ====== MAIN — BATTLE POWER ====== */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-6">
        <div className="relative overflow-hidden rounded-2xl border border-matrix/40 bg-black/70 p-5 md:p-8 backdrop-blur">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-matrix to-transparent" />

          {/* status row */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.25em]">
            <span className="flex items-center gap-2 text-matrix">
              <Swords className="h-3 w-3 animate-pulse" />
              battle #047 // in progress
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3 w-3" />
              resolves in <BattleCountdown />
            </span>
          </div>

          {/* Side headers */}
          <div className="mb-3 flex items-end justify-between gap-4">
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-[0.3em] text-tesla">//OPTIMUS</p>
              <h3 className="mt-1 text-xl font-black md:text-3xl text-tesla">Tesla Bot</h3>
              <p className="mt-1 font-mono text-2xl md:text-4xl font-bold text-tesla">{TESLA_POWER_PCT}%</p>
            </div>
            <div className="hidden md:flex flex-col items-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span>battle power</span>
              <Swords className="mt-1 h-4 w-4 text-matrix" />
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gpt">//OMNI</p>
              <h3 className="mt-1 text-xl font-black md:text-3xl text-gpt">GPT Bot</h3>
              <p className="mt-1 font-mono text-2xl md:text-4xl font-bold text-gpt">{GPT_POWER_PCT}%</p>
            </div>
          </div>

          {/* One big horizontal Battle Power bar */}
          <div className="relative h-10 md:h-12 w-full overflow-hidden rounded-full border border-matrix/20 bg-white/5">
            <div
              className="absolute inset-y-0 left-0 bg-tesla"
              style={{ width: `${TESLA_POWER_PCT}%`, boxShadow: "0 0 20px hsl(var(--tesla))" }}
            />
            <div
              className="absolute inset-y-0 right-0 bg-gpt"
              style={{ width: `${GPT_POWER_PCT}%`, boxShadow: "0 0 20px hsl(var(--gpt))" }}
            />
            <div className="absolute inset-y-0 left-1/2 w-px bg-background/60" />
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>{(TESLA_SUPPLY / 1_000_000).toFixed(2)}M $VSAI committed</span>
            <span className="text-matrix">leader · {GPT_POWER_PCT > TESLA_POWER_PCT ? "GPT" : "TESLA"}</span>
            <span>{(GPT_SUPPLY / 1_000_000).toFixed(2)}M $VSAI committed</span>
          </div>

          {/* Pick CTAs */}
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <Button
              asChild
              className="h-12 bg-tesla text-background hover:bg-tesla/90 font-bold uppercase tracking-[0.2em] border-0"
              style={{ boxShadow: "0 0 24px hsl(var(--tesla) / 0.55)" }}
            >
              <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">Pick Tesla Bot</a>
            </Button>
            <Button
              asChild
              className="h-12 bg-gpt text-background hover:bg-gpt/90 font-bold uppercase tracking-[0.2em] border-0"
              style={{ boxShadow: "0 0 24px hsl(var(--gpt) / 0.55)" }}
            >
              <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">Pick GPT Bot</a>
            </Button>
          </div>

          {/* compact stat strip */}
          <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Stat label="Pool" value={`${((TESLA_SUPPLY + GPT_SUPPLY) / 1_000_000).toFixed(1)}M`} />
            <Stat label="≈ SOL" value={`◎ ${SOL_VALUE.toFixed(1)}`} />
            <Stat label="≈ USD" value={`$${(USD_VALUE / 1000).toFixed(1)}K`} />
            <Stat label="Last Winner" value="GPT" highlight />
          </div>

          <p className="mt-5 border-t border-matrix/15 pt-4 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            pick your side = lock $VSAI behind your chosen bot
          </p>
        </div>
      </section>

      {/* ====== PARTICIPATION REWARDS — directly below Battle Power ====== */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-10">
        <div className="relative overflow-hidden rounded-2xl border border-matrix/30 bg-card/40 p-5 md:p-7 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-matrix">
              <Lock className="h-4 w-4" />
              <p className="text-[10px] uppercase tracking-[0.35em]">// your supply is never spent</p>
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              lock until battle resolution <span className="text-matrix">(up to 24h)</span>
            </span>
          </div>

          <h2 className="mt-2 text-xl font-black tracking-tight md:text-2xl">
            Lock $VSAI · Earn Bonus · Get It All Back
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <RewardStep icon={Lock} title="Lock $VSAI" body="Until battle resolution (up to 24h)." />
            <RewardStep icon={Swords} title="Back Your Side" body="Your supply boosts Battle Power." />
            <RewardStep icon={RotateCw} title="Supply Returns" body="Automatically released on resolution." />
            <RewardStep icon={Gift} title="Earn Bonus $VSAI" body="Paid out to participants every battle." />
          </div>
        </div>
      </section>

      {/* ====== WEEKLY VAULT SURVEILLANCE ====== */}
      <Section eyebrow="// reserve activity" title="Weekly Vault Surveillance">
        <div className="grid gap-3 md:grid-cols-3">
          {vaultEvents.map((op) => (
            <VaultEventCard key={op.name} {...op} />
          ))}
        </div>
      </Section>

      {/* ====== COMMUNITY MILESTONES ====== */}
      <Section eyebrow="// community goals" title="Milestones">
        <div className="grid gap-2 md:grid-cols-2">
          {milestones.map((m) => (
            <MilestoneRow key={m.label} {...m} />
          ))}
        </div>
      </Section>

      {/* ====== TRANSMISSION ARCHIVE ====== */}
      <Section eyebrow="// transmission archive" title="Recovered Footage">
        <div className="grid gap-3 md:grid-cols-3">
          {transmissions.map((t) => (
            <TransmissionCard key={t.title} {...t} />
          ))}
        </div>
        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          follow <a href={X_URL} target="_blank" rel="noreferrer" className="text-matrix hover:opacity-80">X ↗</a> for intelligence updates, battle reports, and transmission releases
        </p>
      </Section>

      {/* ====== FINAL CTA ====== */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 py-12 md:py-16">
        <div className="relative overflow-hidden rounded-2xl border border-matrix/40 bg-black/80 p-8 text-center backdrop-blur md:p-14">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-matrix to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-matrix to-transparent" />

          <div className="relative">
            <h2 className="text-4xl font-black leading-[0.95] tracking-tight text-matrix text-glow md:text-7xl">
              PICK YOUR SIDE
            </h2>
            <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground md:text-base">
              <span className="text-tesla">Tesla Bot</span>
              <span className="mx-2 text-muted-foreground/60">//</span>
              <span className="text-gpt">GPT Bot</span>
            </p>

            <div className="mt-8 flex flex-col items-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-14 px-10 text-base font-bold text-background hover:opacity-90"
                style={{ backgroundColor: "hsl(var(--matrix))", boxShadow: "0 0 30px hsl(var(--matrix) / 0.55)" }}
              >
                <a href={BUY_URL} target="_blank" rel="noreferrer">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Buy $VSAI
                </a>
              </Button>

              <div className="grid w-full max-w-md grid-cols-2 gap-3">
                <Button
                  asChild
                  className="h-12 bg-tesla text-background hover:bg-tesla/90 font-bold uppercase tracking-[0.2em] border-0"
                  style={{ boxShadow: "0 0 24px hsl(var(--tesla) / 0.55)" }}
                >
                  <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">Pick Tesla Bot</a>
                </Button>
                <Button
                  asChild
                  className="h-12 bg-gpt text-background hover:bg-gpt/90 font-bold uppercase tracking-[0.2em] border-0"
                  style={{ boxShadow: "0 0 24px hsl(var(--gpt) / 0.55)" }}
                >
                  <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">Pick GPT Bot</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-matrix/10 px-5 py-8 md:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-matrix transition">Telegram ↗</a>
            <a href={X_URL} target="_blank" rel="noreferrer" className="hover:text-matrix transition">X ↗</a>
            <a href={SITE_URL} target="_blank" rel="noreferrer" className="hover:text-matrix transition">Website ↗</a>
            <span className="text-matrix">CA — coming soon</span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
            <span className="text-matrix">$VSAI is real</span> · fake CA's are not
          </p>
        </div>
      </footer>
    </main>
  );
};

/* ---------- Subcomponents ---------- */

const Section = ({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="relative z-10 mx-auto max-w-6xl px-5 py-8 md:py-10">
    <div className="mb-5">
      <p className="text-[10px] uppercase tracking-[0.35em] text-matrix">{eyebrow}</p>
      <h2 className="mt-1 text-xl font-black tracking-tight md:text-2xl">{title}</h2>
    </div>
    {children}
  </section>
);

const Stat = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="rounded-lg border border-matrix/10 bg-black/40 p-2.5">
    <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
    <p className={`mt-0.5 font-mono text-sm font-bold md:text-base ${highlight ? "text-matrix text-glow" : "text-foreground"}`}>
      {value}
    </p>
  </div>
);

const RewardStep = ({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Lock;
  title: string;
  body: string;
}) => (
  <div className="rounded-xl border border-matrix/15 bg-black/40 p-3.5">
    <Icon className="h-4 w-4 text-matrix" />
    <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em]">{title}</p>
    <p className="mt-1 text-[11px] text-muted-foreground">{body}</p>
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

/* ---------- Battle Countdown ---------- */

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
  return <span className="font-mono text-matrix">{label}</span>;
};

/* ---------- Weekly Vault Surveillance ---------- */

const vaultEvents = [
  {
    icon: Flame,
    name: "Reserve Burn Event",
    code: "VLT-01",
    detail: "120K $VSAI",
    sub: "scheduled · this week",
  },
  {
    icon: ShoppingCart,
    name: "Reserve Purchase Event",
    code: "VLT-02",
    detail: "◎ 8.5 SOL",
    sub: "allocated · pending execution",
  },
  {
    icon: Gift,
    name: "Participant Reward Event",
    code: "VLT-03",
    detail: "75K $VSAI",
    sub: "distributed · last 24h",
  },
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
            <PlayCircle className="relative h-12 w-12 text-matrix opacity-90 transition group-hover:scale-110" style={{ filter: "drop-shadow(0 0 12px hsl(var(--matrix)))" }} />
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
