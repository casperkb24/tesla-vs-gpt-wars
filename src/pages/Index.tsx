import { useEffect, useState } from "react";
import { Send, Terminal, Lock, Radio, Shield, Activity, Cpu, Satellite, Triangle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const TELEGRAM_URL = "https://t.me/AI_war_casperKObe24";
const X_URL = "https://x.com/casperkobe24?s=21";
const SITE_URL = "https://tesla-vs-gpt-wars.lovable.app";

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

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pt-10 pb-12 text-center md:pt-20">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-matrix/40 bg-card/60 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-matrix backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-matrix" />
          intelligence portal // live
        </span>

        <h1 className="text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">
          AI War is <span className="text-matrix text-glow">coming</span> on-chain
        </h1>
        <p className="mt-3 text-base text-muted-foreground md:text-lg leading-relaxed">
          Two AI civilizations<br />One future<br />Pick your side
        </p>
        <p className="mt-6 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          &gt;_ pre-launch // pick your side
        </p>

        {/* VS Bots */}
        <div className="mt-10 grid w-full grid-cols-2 gap-3 md:gap-6">
          <BotCard side="tesla" name="Tesla Bot" tag="//OPTIMUS" support={48} />
          <BotCard side="gpt" name="GPT Bot" tag="//OMNI" support={52} />
        </div>

        {/* Contract */}
        <div className="mt-12 w-full rounded-xl border border-dashed border-matrix/30 bg-card/40 px-4 py-5 text-center backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.3em] text-matrix">CA — coming soon</p>
        </div>

        {/* Primary CTA */}
        <div className="mt-12 flex w-full flex-col items-center gap-4">
          <p className="text-sm font-medium text-foreground/90 md:text-base">
            Join early — don't miss launch
          </p>
          <Button
            asChild
            size="lg"
            className="h-14 w-full max-w-xs px-8 text-base font-bold text-background hover:opacity-90"
            style={{ backgroundColor: "hsl(var(--matrix))" }}
          >
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
              <Send className="mr-2 h-5 w-5" />
              Join Telegram
            </a>
          </Button>
        </div>
      </section>

      {/* INTELLIGENCE BRIEFING */}
      <Section eyebrow="// 02" title="Intelligence Briefing" subtitle="Locations under active observation">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {briefings.map((b) => (
            <IntelCard key={b.title} {...b} />
          ))}
        </div>
      </Section>

      {/* WAR ROOM PREVIEW */}
      <Section eyebrow="// 03" title="War Room Preview" subtitle="Live telemetry — unverified">
        <div className="rounded-xl border border-matrix/20 bg-card/40 p-5 md:p-8 backdrop-blur">
          <div className="mb-6 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-matrix" />
              system: online
            </span>
            <span>sector // global</span>
          </div>

          <div className="space-y-5">
            <InfluenceBar label="Tesla Influence" value={48} side="tesla" />
            <InfluenceBar label="GPT Influence" value={52} side="gpt" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
            <Stat label="Territories Monitored" value="147" />
            <Stat label="Intel Reports Active" value="2,318" />
            <Stat label="Conflict Readiness" value="DEFCON 3" highlight />
            <Stat label="Encrypted Channels" value="42" />
            <Stat label="Faction Operatives" value="∞" />
            <Stat label="Signal Integrity" value="98.7%" />
          </div>
        </div>
      </Section>

      {/* CLASSIFIED SYSTEMS */}
      <Section eyebrow="// 04" title="Classified Systems" subtitle="Access restricted">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {classified.map((c) => (
            <ClassifiedCard key={c} name={c} />
          ))}
        </div>
      </Section>

      {/* INTELLIGENCE FEED */}
      <Section eyebrow="// 05" title="Intelligence Feed" subtitle="Intercepted transmissions — last 72h">
        <div className="rounded-xl border border-matrix/20 bg-black/60 p-4 md:p-6 backdrop-blur">
          <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-matrix">
            <Radio className="h-3 w-3 animate-pulse" />
            live feed
          </div>
          <ul className="space-y-3 font-mono text-xs md:text-sm">
            {feed.map((entry, i) => (
              <li key={i} className="flex gap-3 border-l border-matrix/30 pl-3 text-muted-foreground">
                <span className="text-matrix/70 shrink-0">[{entry.ts}]</span>
                <span>{entry.msg}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* VIDEO ARCHIVE */}
      <Section eyebrow="// 06" title="War Report Archive" subtitle="Future battle reports and intelligence briefings will appear here">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                  transmission #{String(i).padStart(3, "0")}
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

      {/* TIMELINE */}
      <Section eyebrow="// 07" title="Operational Timeline" subtitle="Phased deployment">
        <div className="relative space-y-6 md:space-y-8">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-matrix/60 via-matrix/20 to-transparent md:left-3" />
          {timeline.map((t, i) => (
            <div key={t.phase} className="relative flex gap-5 md:gap-8">
              <div className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-matrix/60 bg-black">
                <span className="h-2 w-2 rounded-full bg-matrix" />
              </div>
              <div className="flex-1 border-b border-matrix/10 pb-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-matrix">Phase {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 text-lg font-bold md:text-2xl">{t.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* FINAL TRANSMISSION */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 py-20 md:py-32">
        <div className="relative overflow-hidden rounded-2xl border border-matrix/40 bg-black/80 p-8 text-center backdrop-blur md:p-16">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-matrix to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-matrix to-transparent" />

          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-matrix">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-matrix" />
              final transmission // incoming
            </div>

            <h2 className="text-4xl font-black leading-[0.95] tracking-tight text-matrix text-glow md:text-7xl">
              PICK YOUR SIDE
            </h2>

            <div className="mx-auto mt-8 max-w-md space-y-3 text-sm text-muted-foreground md:text-base">
              <p>The AI War is approaching</p>
              <p>Two paths<br />Two futures<br />One decision</p>
              <p className="pt-2">
                <span className="text-tesla">Tesla Bot</span>
                <span className="mx-2 text-muted-foreground/60">//</span>
                <span className="text-gpt">GPT Bot</span>
              </p>
              <p className="pt-2 italic">The choice will soon matter</p>
            </div>

            <div className="mt-10 flex flex-col items-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-14 px-10 text-base font-bold text-background hover:opacity-90"
                style={{ backgroundColor: "hsl(var(--matrix))" }}
              >
                <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
                  Pick Your Side
                </a>
              </Button>
              <span className="text-[11px] uppercase tracking-[0.3em] text-matrix">$VSAI</span>
            </div>

            <p className="mt-10 border-t border-matrix/20 pt-6 text-xs italic text-muted-foreground">
              "The future will not be decided by machines.<br />
              It will be decided by those who pick a side."
            </p>
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
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-matrix transition">
              Telegram ↗
            </a>
            <a href={X_URL} target="_blank" rel="noreferrer" className="hover:text-matrix transition">
              X ↗
            </a>
            <a href={SITE_URL} target="_blank" rel="noreferrer" className="hover:text-matrix transition">
              Official Website ↗
            </a>
            <span className="text-matrix">CA — coming soon</span>
          </div>
          <p className="text-xs tracking-wide text-muted-foreground">
            <span className="text-matrix">$VSAI is real</span>
            <br />
            Fake CA's are not
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
            &gt;_ pick your side
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
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section className="relative z-10 mx-auto max-w-6xl px-5 py-16 md:py-24">
    <div className="mb-8 md:mb-12">
      <p className="text-[10px] uppercase tracking-[0.35em] text-matrix">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{subtitle}</p>}
    </div>
    {children}
  </section>
);

const BotCard = ({
  side,
  name,
  tag,
  support,
}: {
  side: "tesla" | "gpt";
  name: string;
  tag: string;
  support: number;
}) => {
  const isTesla = side === "tesla";
  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-card/60 p-4 backdrop-blur transition duration-300 hover:-translate-y-0.5 md:p-6 ${
        isTesla
          ? "border-tesla/40 glow-tesla-soft hover:glow-tesla hover:border-tesla"
          : "border-gpt/40 glow-gpt-soft hover:glow-gpt hover:border-gpt"
      }`}
    >
      <div
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl ${
          isTesla ? "bg-tesla/30" : "bg-gpt/30"
        }`}
      />
      <div className="relative flex flex-col items-start gap-2">
        <span className={`text-[10px] tracking-[0.25em] ${isTesla ? "text-tesla" : "text-gpt"}`}>{tag}</span>
        <span className="text-lg font-bold md:text-2xl">{name}</span>
        <div className="mt-2 w-full">
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            <span>faction support</span>
            <span className={isTesla ? "text-tesla" : "text-gpt"}>{support}%</span>
          </div>
          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full ${isTesla ? "bg-tesla" : "bg-gpt"}`}
              style={{ width: `${support}%` }}
            />
          </div>
        </div>
        <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">pick side</span>
      </div>
    </div>
  );
};

const briefings = [
  {
    icon: Activity,
    code: "LOC-01",
    title: "Fusion Reactor Alpha",
    desc: "A strategic energy source currently under observation. Output signatures suggest reactivation imminent.",
  },
  {
    icon: Shield,
    code: "LOC-02",
    title: "Quantum Vault",
    desc: "A classified facility containing advanced computational resources. Access pathways remain unmapped.",
  },
  {
    icon: Cpu,
    code: "LOC-03",
    title: "Neural Core Nexus",
    desc: "A central intelligence hub with unknown capabilities. Signal patterns defy current analysis.",
  },
  {
    icon: Satellite,
    code: "LOC-04",
    title: "Mars Launch Facility",
    desc: "A forward operating base preparing for expansion. Orbital telemetry redacted.",
  },
  {
    icon: Triangle,
    code: "LOC-05",
    title: "Titan Robotics Complex",
    desc: "An autonomous manufacturing stronghold. Production volume exceeds reported figures.",
  },
  {
    icon: Radio,
    code: "LOC-06",
    title: "Orbital Relay 9",
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
    <p className="mt-4 text-[9px] uppercase tracking-[0.3em] text-matrix/70">status: monitoring</p>
  </div>
);

const InfluenceBar = ({ label, value, side }: { label: string; value: number; side: "tesla" | "gpt" }) => {
  const isTesla = side === "tesla";
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em]">
        <span className={isTesla ? "text-tesla" : "text-gpt"}>{label}</span>
        <span className="font-mono text-muted-foreground">{value}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full ${isTesla ? "bg-tesla" : "bg-gpt"}`}
          style={{ width: `${value}%`, boxShadow: `0 0 12px hsl(var(--${side}))` }}
        />
      </div>
    </div>
  );
};

const Stat = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="rounded-lg border border-matrix/10 bg-black/40 p-3">
    <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
    <p className={`mt-1 font-mono text-lg font-bold ${highlight ? "text-matrix text-glow" : "text-foreground"}`}>
      {value}
    </p>
  </div>
);

const classified = [
  "Battle Vault Protocol",
  "MegaTron Division",
  "Territory Control Network",
  "Neural Eclipse Event",
  "Operation Iron Titan",
  "Omega Protocol",
];

const ClassifiedCard = ({ name }: { name: string }) => (
  <div className="group relative overflow-hidden rounded-xl border border-matrix/20 bg-card/30 p-5 backdrop-blur">
    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,hsl(var(--matrix)/0.04)_8px,hsl(var(--matrix)/0.04)_9px)]" />
    <div className="relative">
      <div className="flex items-center justify-between">
        <Lock className="h-4 w-4 text-matrix/60" />
        <span className="text-[9px] uppercase tracking-[0.3em] text-destructive/70">restricted</span>
      </div>
      <h3 className="mt-4 text-base font-bold md:text-lg">{name}</h3>
      <p className="mt-3 inline-block rounded border border-matrix/30 bg-black/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em] text-matrix">
        [classified]
      </p>
    </div>
  </div>
);

const feed = [
  { ts: "04:21:07", msg: "GPT reconnaissance activity detected near the Quantum Vault" },
  { ts: "03:58:42", msg: "Tesla Robotics expanded operations in Sector Alpha" },
  { ts: "03:14:19", msg: "Encrypted transmission intercepted // signal source unknown" },
  { ts: "02:47:55", msg: "Anomalous heat signature recorded at Fusion Reactor Alpha" },
  { ts: "02:11:03", msg: "Unidentified payload launched from Mars Launch Facility" },
  { ts: "01:39:28", msg: "Neural Core Nexus broadcast frequency shifted — analysis pending" },
  { ts: "01:02:11", msg: "Titan Robotics Complex output increased by undisclosed margin" },
  { ts: "00:46:33", msg: "Faction operatives confirmed in three additional territories" },
  { ts: "00:18:09", msg: "Orbital Relay 9 rerouted traffic to unverified endpoint" },
  { ts: "00:02:14", msg: "Further details classified // standby for next transmission" },
];

const timeline = [
  { phase: "01", title: "Pick Your Side" },
  { phase: "02", title: "War Room Activation" },
  { phase: "03", title: "Territory Intelligence" },
  { phase: "04", title: "Classified Systems" },
  { phase: "05", title: "Conflict Approaching" },
  { phase: "06", title: "Transmission Incoming" },
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

export default Index;
