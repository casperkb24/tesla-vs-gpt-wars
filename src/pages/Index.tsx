import { Send, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const TELEGRAM_URL = "https://t.me/AI_war_casperKObe24";

const Index = () => {

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-5 py-5 md:px-10">
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <Terminal className="h-5 w-5 text-matrix" />
          <span className="text-matrix text-glow">$VSAI</span>
        </div>
        <div className="flex flex-col items-end gap-1 text-[10px] md:text-xs uppercase tracking-[0.2em]">
          <a
            href="https://tesla-vs-gpt-wars.lovable.app"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-matrix transition"
          >
            Official Website ↗
          </a>
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-matrix transition"
          >
            Official X ↗
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pt-10 pb-12 text-center md:pt-20">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-matrix/40 bg-card/60 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-matrix backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-matrix" />
          coming soon
        </span>

        <h1 className="text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">
          AI War is <span className="text-matrix text-glow">coming</span> on-chain
        </h1>
        <p className="mt-4 text-base font-semibold text-foreground md:text-xl">
          Tesla Bot <span className="text-matrix">vs</span> GPT Bot — Pick a side.
        </p>
        <p className="mt-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          &gt;_ pre-launch // pick your side
        </p>

        {/* VS Bots */}
        <div className="mt-10 grid w-full grid-cols-2 gap-3 md:gap-6">
          <BotCard side="tesla" name="Tesla Bot" tag="//OPTIMUS" />
          <BotCard side="gpt" name="GPT Bot" tag="//OMNI" />
        </div>

        {/* Contract */}
        <div className="mt-12 w-full rounded-xl border border-dashed border-matrix/30 bg-card/40 px-4 py-5 text-center backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.3em] text-matrix">
            CA — coming soon
          </p>
        </div>

        {/* Primary CTA */}
        <div className="mt-16 flex w-full flex-col items-center gap-4">
          <p className="text-sm font-medium text-foreground/90 md:text-base">
            Join early. Don't miss launch.
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

        <p className="mt-16 text-xs tracking-wide text-muted-foreground">
          <span className="text-matrix">$VSAI is real.</span>
          <br />
          Fake CA's are not.
        </p>
      </section>
    </main>
  );
};

const BotCard = ({ side, name, tag }: { side: "tesla" | "gpt"; name: string; tag: string }) => {
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
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-opacity ${
          isTesla ? "bg-tesla/30" : "bg-gpt/30"
        }`}
      />
      <div className="relative flex flex-col items-start gap-2">
        <span className={`text-[10px] tracking-[0.25em] ${isTesla ? "text-tesla" : "text-gpt"}`}>
          {tag}
        </span>
        <span className="text-lg font-bold md:text-2xl">{name}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          pick side
        </span>
      </div>
    </div>
  );
};

export default Index;
