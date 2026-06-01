import { useEffect, useState } from "react";
import {
  Send,
  Terminal,
  Lock,
  Radio,
  Shield,
  Activity,
  Satellite,
  Play,
  Swords,
  Target,
  TrendingUp,
  Crosshair,
  Clock,
  Trophy,
  Users,
  Flame,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TELEGRAM_URL = "https://t.me/AI_war_casperKObe24";
const X_URL = "https://x.com/casperkobe24?s=21";
const SITE_URL = "https://tesla-vs-gpt-wars.lovable.app";

/* ---------- Live mock numbers (placeholder data) ---------- */
const TESLA_SUPPLY_PCT = 47.3;
const GPT_SUPPLY_PCT = 52.7;
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
        <div className="flex flex-col items-end gap-1 text-[10px] md:text-xs uppercase tracking-[0.2em]">
          <a href={SITE_URL} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-matrix transition">
            Official Website ↗
          </a>
          <a href={X_URL} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-matrix transition">
            Official X ↗
          </a>
        </div>
      </header>

      {/* Hero — compact */}
      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pt-6 pb-10 text-center md:pt-12">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-matrix/40 bg-card/60 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-matrix backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-matrix" />
          live battle monitor // online
        </span>

        <h1 className="text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">
          AI War is <span className="text-matrix text-glow">live</span> on-chain
        </h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          Hold <span className="text-matrix">$VSAI</span> — pick Tesla Bot or GPT Bot — every 24h one side wins
        </p>
        <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          &gt;_ scroll for live battle totals
        </p>
      </section>

      {/* ====== 01 — MAIN BATTLE MONITOR ====== */}
      <Section
        eyebrow="// 01 — main event"
        title="$VSAI Battle Monitor"
        subtitle="Live supply backing each side — battle resolves daily"
      >
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

          {/* odds-style split */}
          <div className="grid gap-4 md:grid-cols-2">
            <SideCard
              side="tesla"
              name="Tesla Bot"
              tag="//OPTIMUS"
              pct={TESLA_SUPPLY_PCT}
              supply={TESLA_SUPPLY}
              leading={TESLA_SUPPLY_PCT > GPT_SUPPLY_PCT}
            />
            <SideCard
              side="gpt"
              name="GPT Bot"
              tag="//OMNI"
              pct={GPT_SUPPLY_PCT}
              supply={GPT_SUPPLY}
              leading={GPT_SUPPLY_PCT > TESLA_SUPPLY_PCT}
            />
          </div>

          {/* combined bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <span className="text-tesla">{TESLA_SUPPLY_PCT}% tesla</span>
              <span>percent control</span>
              <span className="text-gpt">{GPT_SUPPLY_PCT}% gpt</span>
            </div>
            <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-white/5">
              <div className="bg-tesla" style={{ width: `${TESLA_SUPPLY_PCT}%`, boxShadow: "0 0 10px hsl(var(--tesla))" }} />
              <div className="bg-gpt" style={{ width: `${GPT_SUPPLY_PCT}%`, boxShadow: "0 0 10px hsl(var(--gpt))" }} />
            </div>
          </div>

          {/* coin stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Total $VSAI Committed" value={`${((TESLA_SUPPLY + GPT_SUPPLY) / 1_000_000).toFixed(2)}M`} />
            <Stat label="Estimated SOL" value={`◎ ${SOL_VALUE.toFixed(2)}`} />
            <Stat label="Estimated USD" value={`$${USD_VALUE.toLocaleString()}`} />
            <Stat
              label="Current Leader"
              value={GPT_SUPPLY_PCT > TESLA_SUPPLY_PCT ? "GPT" : "TESLA"}
              highlight
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Last Winner" value="GPT" />
            <Stat label="Win Streak" value="2" />
            <Stat label="Battles Resolved" value="46" />
            <Stat label="Next Snapshot" value="00:00 UTC" />
          </div>

          {/* pick side CTAs */}
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <Button
              asChild
              className="h-12 border border-tesla/50 bg-tesla/10 text-tesla hover:bg-tesla/20 font-bold uppercase tracking-[0.2em]"
            >
              <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">Back Tesla Bot</a>
            </Button>
            <Button
              asChild
              className="h-12 border border-gpt/50 bg-gpt/10 text-gpt hover:bg-gpt/20 font-bold uppercase tracking-[0.2em]"
            >
              <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">Back GPT Bot</a>
            </Button>
          </div>

          <p className="mt-5 border-t border-matrix/15 pt-4 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            pick your side = hold $VSAI for your chosen bot
          </p>
        </div>
      </Section>

      {/* ====== 02 — SPECIAL OPERATIONS (compact, 3 cards) ====== */}
      <Section
        eyebrow="// 02 — bonus missions"
        title="Special Operations"
        subtitle="Reserve-funded bonus missions — separate from daily battle"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {specialOps.map((op) => (
            <SpecialOpCard key={op.name} {...op} />
          ))}
        </div>
      </Section>

      {/* ====== 03 — EXPANSION MONITOR ====== */}
      <Section
        eyebrow="// 03 — community goals"
        title="$VSAI Expansion Monitor"
        subtitle="Hit the goals — unlock the outcomes"
      >
        <div className="grid gap-3 md:grid-cols-2">
          {expansion.map((m) => (
            <ExpansionRow key={m.label} {...m} />
          ))}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {milestones.map((m) => (
            <MilestoneCard key={m.title} {...m} />
          ))}
        </div>
      </Section>

      {/* ====== 04 — ANTICIPATED BATTLE LOCATIONS (3 only) ====== */}
      <Section
        eyebrow="// 04 — recon"
        title="Anticipated Battle Locations"
        subtitle="Next sectors under active observation"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {briefings.map((b) => (
            <IntelCard key={b.title} {...b} />
          ))}
        </div>
      </Section>

      {/* ====== 05 — INTELLIGENCE FEED ====== */}
      <Section eyebrow="// 05 — live" title="Intelligence Feed" subtitle="Intercepted transmissions — last 24h">
        <div className="rounded-xl border border-matrix/20 bg-black/60 p-4 md:p-6 backdrop-blur">
          <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-matrix">
            <Radio className="h-3 w-3 animate-pulse" />
            live feed
          </div>
          <ul className="space-y-2.5 font-mono text-xs md:text-sm">
            {feed.map((entry, i) => (
              <li key={i} className="flex gap-3 border-l border-matrix/30 pl-3 text-muted-foreground">
                <span className="text-matrix/70 shrink-0">[{entry.ts}]</span>
                <span>{entry.msg}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ====== 06 — WAR REPORT ARCHIVE ====== */}
      <Section eyebrow="// 06 — archive" title="War Report Archive" subtitle="Daily battle recaps">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="group relative aspect-video overflow-hidden rounded-xl border border-matrix/20 bg-card/40 backdrop-blur"
            >
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-matrix/10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-matrix/40 bg-black/60 backdrop-blur">
                  <Play className="h-5 w-5 text-matrix" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  battle #{String(46 - i + 1).padStart(3, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-matrix">awaiting upload</span>
              </div>
              <div className="absolute left-3 top-3 text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                rec • {String(i).padStart(2, "0")}:00
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ====== 07 — CLASSIFIED (small strip) ====== */}
      <Section eyebrow="// 07 — restricted" title="Classified Systems">
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {classified.map((c) => (
            <div
              key={c}
              className="flex items-center gap-2 rounded-lg border border-matrix/15 bg-card/30 px-3 py-2 backdrop-blur"
            >
              <Lock className="h-3 w-3 text-matrix/60 shrink-0" />
              <span className="truncate text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{c}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ====== FINAL CTA ====== */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 py-16 md:py-24">
        <div className="relative overflow-hidden rounded-2xl border border-matrix/40 bg-black/80 p-8 text-center backdrop-blur md:p-14">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-matrix to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-matrix to-transparent" />

          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-matrix">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-matrix" />
              final transmission
            </div>

            <h2 className="text-4xl font-black leading-[0.95] tracking-tight text-matrix text-glow md:text-7xl">
              PICK YOUR SIDE
            </h2>

            <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground md:text-base">
              <span className="text-tesla">Tesla Bot</span>
              <span className="mx-2 text-muted-foreground/60">//</span>
              <span className="text-gpt">GPT Bot</span>
            </p>

            <div className="mt-8 flex flex-col items-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-14 px-10 text-base font-bold text-background hover:opacity-90"
                style={{ backgroundColor: "hsl(var(--matrix))" }}
              >
                <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
                  <Send className="mr-2 h-5 w-5" />
                  Join Telegram
                </a>
              </Button>
              <span className="text-[11px] uppercase tracking-[0.3em] text-matrix">$VSAI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-matrix/10 px-5 py-10 md:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2 font-bold tracking-tight">
            <Terminal className="h-4 w-4 text-matrix" />
            <span className="text-matrix text-glow">$VSAI</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-matrix transition">Telegram ↗</a>
            <a href={X_URL} target="_blank" rel="noreferrer" className="hover:text-matrix transition">X ↗</a>
            <a href={SITE_URL} target="_blank" rel="noreferrer" className="hover:text-matrix transition">Official Website ↗</a>
            <span className="text-matrix">CA — coming soon</span>
          </div>
          <p className="text-xs tracking-wide text-muted-foreground">
            <span className="text-matrix">$VSAI is real</span>
            <br />
            Fake CA's are not
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">&gt;_ pick your side</p>
        </div>
      </footer>
    </main>
  );
};

/* ---------- Subcomponents ---------- */

const Section = ({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section className="relative z-10 mx-auto max-w-6xl px-5 py-10 md:py-14">
    <div className="mb-6 md:mb-8">
      <p className="text-[10px] uppercase tracking-[0.35em] text-matrix">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{subtitle}</p>}
    </div>
    {children}
  </section>
);

const SideCard = ({
  side,
  name,
  tag,
  pct,
  supply,
  leading,
}: {
  side: "tesla" | "gpt";
  name: string;
  tag: string;
  pct: number;
  supply: number;
  leading: boolean;
}) => {
  const isTesla = side === "tesla";
  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-card/60 p-5 backdrop-blur transition ${
        isTesla
          ? "border-tesla/40 glow-tesla-soft hover:glow-tesla"
          : "border-gpt/40 glow-gpt-soft hover:glow-gpt"
      }`}
    >
      <div
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl ${
          isTesla ? "bg-tesla/30" : "bg-gpt/30"
        }`}
      />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <span className={`text-[10px] tracking-[0.25em] ${isTesla ? "text-tesla" : "text-gpt"}`}>{tag}</span>
            <h3 className="mt-1 text-xl font-bold md:text-2xl">{name}</h3>
          </div>
          {leading && (
            <span className={`rounded border px-2 py-0.5 text-[9px] uppercase tracking-[0.25em] ${
              isTesla ? "border-tesla/50 text-tesla" : "border-gpt/50 text-gpt"
            }`}>
              leading
            </span>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between">
          <span className={`font-mono text-3xl font-bold md:text-4xl ${isTesla ? "text-tesla" : "text-gpt"}`}>
            {pct.toFixed(1)}%
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">control</span>
        </div>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full ${isTesla ? "bg-tesla" : "bg-gpt"}`}
            style={{ width: `${pct}%`, boxShadow: `0 0 10px hsl(var(--${side}))` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-[0.2em]">
          <div>
            <p className="text-muted-foreground">supply committed</p>
            <p className="mt-0.5 font-mono text-sm text-foreground">{(supply / 1_000_000).toFixed(2)}M $VSAI</p>
          </div>
          <div>
            <p className="text-muted-foreground">odds</p>
            <p className="mt-0.5 font-mono text-sm text-foreground">{(100 / pct).toFixed(2)}x</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="rounded-lg border border-matrix/10 bg-black/40 p-3">
    <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
    <p className={`mt-1 font-mono text-base font-bold md:text-lg ${highlight ? "text-matrix text-glow" : "text-foreground"}`}>
      {value}
    </p>
  </div>
);

/* ---------- Anticipated Locations ---------- */

const briefings = [
  {
    icon: Satellite,
    code: "LOC-01",
    title: "Mars Launch Facility",
    desc: "Forward operating base preparing for expansion. Orbital telemetry redacted.",
  },
  {
    icon: Shield,
    code: "LOC-02",
    title: "Quantum Vault",
    desc: "Classified facility containing advanced computational resources. Access pathways unmapped.",
  },
  {
    icon: Radio,
    code: "LOC-03",
    title: "Orbital Relay",
    desc: "Encrypted relay node redirecting traffic between unknown endpoints. Origin unverified.",
  },
];

const IntelCard = ({
  icon: Icon,
  code,
  title,
  desc,
}: {
  icon: typeof Activity;
  code: string;
  title: string;
  desc: string;
}) => (
  <div className="group relative overflow-hidden rounded-xl border border-matrix/20 bg-card/40 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:border-matrix/50">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-matrix/40 to-transparent" />
    <div className="flex items-center justify-between">
      <Icon className="h-5 w-5 text-matrix" />
      <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{code}</span>
    </div>
    <h3 className="mt-4 text-base font-bold md:text-lg">{title}</h3>
    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{desc}</p>
    <p className="mt-4 text-[9px] uppercase tracking-[0.3em] text-matrix/70">status // monitoring</p>
  </div>
);

const classified = [
  "Battle Vault Protocol",
  "MegaTron Division",
  "Territory Control",
  "Neural Eclipse",
  "Operation Iron Titan",
  "Omega Protocol",
];

const feed = [
  { ts: "04:21:07", msg: "GPT supply surge detected — +1.2M $VSAI committed" },
  { ts: "03:58:42", msg: "Tesla faction reclaimed Sector Alpha control" },
  { ts: "03:14:19", msg: "Encrypted transmission intercepted // signal source unknown" },
  { ts: "02:47:55", msg: "Bonus mission OP-A7 crossed 60% threshold" },
  { ts: "02:11:03", msg: "Unidentified payload launched from Mars Launch Facility" },
  { ts: "01:39:28", msg: "Holder count breached 1,800 — expansion goal advancing" },
  { ts: "01:02:11", msg: "Volume surge: +$42K in last hour" },
  { ts: "00:18:09", msg: "Orbital Relay rerouted traffic to unverified endpoint" },
];

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

/* ---------- Special Operations (3 compact cards) ---------- */

const specialOps = [
  {
    icon: Crosshair,
    name: "Hacked Artillery Network",
    code: "OP-A7",
    tesla: 64,
    gpt: 36,
    threshold: 80,
    bonus: "250K $VSAI",
    status: "active",
  },
  {
    icon: Satellite,
    name: "Orbital Relay Breach",
    code: "OP-R9",
    tesla: 38,
    gpt: 62,
    threshold: 75,
    bonus: "400K $VSAI",
    status: "active",
  },
  {
    icon: Shield,
    name: "Reactor Override",
    code: "OP-S1",
    tesla: 52,
    gpt: 48,
    threshold: 70,
    bonus: "180K $VSAI",
    status: "live",
  },
];

const SpecialOpCard = ({
  icon: Icon,
  name,
  code,
  tesla,
  gpt,
  threshold,
  bonus,
  status,
}: {
  icon: typeof Crosshair;
  name: string;
  code: string;
  tesla: number;
  gpt: number;
  threshold: number;
  bonus: string;
  status: string;
}) => (
  <div className="group relative overflow-hidden rounded-xl border border-matrix/20 bg-card/40 p-5 backdrop-blur transition hover:border-matrix/50">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-matrix" />
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{code} // {status}</p>
          <h3 className="mt-0.5 text-base font-bold">{name}</h3>
        </div>
      </div>
      <Trophy className="h-4 w-4 text-matrix/50" />
    </div>

    <div className="mt-4 space-y-2">
      <div>
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em]">
          <span className="text-tesla">Tesla</span>
          <span className="font-mono text-muted-foreground">{tesla}%</span>
        </div>
        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/5">
          <div className="h-full bg-tesla" style={{ width: `${tesla}%` }} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em]">
          <span className="text-gpt">GPT</span>
          <span className="font-mono text-muted-foreground">{gpt}%</span>
        </div>
        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/5">
          <div className="h-full bg-gpt" style={{ width: `${gpt}%` }} />
        </div>
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between border-t border-matrix/15 pt-3 text-[10px] uppercase tracking-[0.2em]">
      <span className="text-muted-foreground">threshold <span className="font-mono text-matrix">{threshold}%</span></span>
      <span className="flex items-center gap-1 text-matrix">
        <Coins className="h-3 w-3" />
        <span className="font-mono">{bonus}</span>
      </span>
    </div>
  </div>
);

/* ---------- Expansion Monitor ---------- */

const expansion = [
  { icon: Users, label: "Holders Today", current: "+184", target: "+500", progress: 37, outcome: "Sector secured" },
  { icon: Activity, label: "24h Volume Goal", current: "$182K", target: "$500K", progress: 36, outcome: "Reserve burn unlocked" },
  { icon: TrendingUp, label: "Market Cap Goal", current: "$1.2M", target: "$5M", progress: 24, outcome: "Facility overrun" },
  { icon: Target, label: "Community Growth", current: "2,310", target: "10,000", progress: 23, outcome: "Network expansion complete" },
  { icon: Radio, label: "Telegram Activity", current: "1.8K msgs", target: "5K msgs", progress: 36, outcome: "Signal boost active" },
  { icon: Flame, label: "X Engagement Goal", current: "412K imp", target: "1M imp", progress: 41, outcome: "Supply eliminated" },
];

const ExpansionRow = ({
  icon: Icon,
  label,
  current,
  target,
  progress,
  outcome,
}: {
  icon: typeof TrendingUp;
  label: string;
  current: string;
  target: string;
  progress: number;
  outcome: string;
}) => (
  <div className="rounded-xl border border-matrix/20 bg-card/40 p-4 backdrop-blur">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-matrix" />
        <span className="text-xs uppercase tracking-[0.25em] text-foreground/90">{label}</span>
      </div>
      <span className="font-mono text-xs text-muted-foreground">
        <span className="text-matrix">{current}</span> / {target}
      </span>
    </div>
    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
      <div
        className="h-full bg-gradient-to-r from-matrix to-matrix/70"
        style={{ width: `${progress}%`, boxShadow: "0 0 10px hsl(var(--matrix))" }}
      />
    </div>
    <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
      unlocks // <span className="text-matrix">{outcome}</span>
    </p>
  </div>
);

const milestones = [
  { title: "Facility Overrun", status: "achieved", note: "Sector 3 secured" },
  { title: "Network Expansion", status: "achieved", note: "Relay 4 online" },
  { title: "Supply Eliminated", status: "pending", note: "Awaiting threshold" },
];

const MilestoneCard = ({
  title,
  status,
  note,
}: {
  title: string;
  status: string;
  note: string;
}) => {
  const achieved = status === "achieved";
  return (
    <div
      className={`rounded-lg border p-4 backdrop-blur ${
        achieved ? "border-matrix/50 bg-matrix/5" : "border-matrix/15 bg-card/30"
      }`}
    >
      <p
        className={`text-[9px] uppercase tracking-[0.3em] ${
          achieved ? "text-matrix" : "text-muted-foreground"
        }`}
      >
        {achieved ? "✓ achieved" : "// pending"}
      </p>
      <h4 className="mt-2 text-sm font-bold">{title}</h4>
      <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{note}</p>
    </div>
  );
};

export default Index;
