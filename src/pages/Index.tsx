import { useState } from "react";
import { Copy, Check, Send, ShoppingCart, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
const BUY_URL = "#";
const TELEGRAM_URL = "#";

const Index = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    toast({ title: "Contract copied", description: "Address in clipboard." });
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-5 py-5 md:px-10">
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <Terminal className="h-5 w-5 text-matrix" />
          <span className="text-matrix text-glow">$VSAI</span>
        </div>
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="text-xs md:text-sm text-muted-foreground hover:text-matrix transition"
        >
          telegram ↗
        </a>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pt-10 pb-12 text-center md:pt-20">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-matrix/40 bg-card/60 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-matrix backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-matrix" />
          live on-chain
        </span>

        <h1 className="text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">
          AI War is <span className="text-matrix text-glow">LIVE</span> on-chain
        </h1>
        <p className="mt-4 text-base font-semibold text-foreground md:text-xl">
          Tesla Bot <span className="text-matrix">vs</span> GPT Bot — Pick a side.
        </p>
        <p className="mt-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          &gt;_ CA below — early
        </p>

        {/* VS Bots */}
        <div className="mt-10 grid w-full grid-cols-2 gap-3 md:gap-6">
          <BotCard side="tesla" name="Tesla Bot" tag="//OPTIMUS" />
          <BotCard side="gpt" name="GPT Bot" tag="//OMNI" />
        </div>

        {/* Contract */}
        <div className="mt-10 w-full">
          <p className="mb-2 text-left text-[11px] uppercase tracking-[0.25em] text-matrix">
            CA below
          </p>
          <button
            onClick={handleCopy}
            className="group flex w-full items-center justify-between gap-3 rounded-xl border border-matrix/30 bg-card/70 px-4 py-3 text-left backdrop-blur transition hover:border-matrix"
          >
            <span className="truncate text-xs md:text-sm text-foreground">{CONTRACT_ADDRESS}</span>
            <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground group-hover:text-matrix">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "copied" : "copy"}
            </span>
          </button>
        </div>

        {/* CTAs */}
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 flex-1 font-bold text-background hover:opacity-90"
            style={{ backgroundColor: "hsl(var(--matrix))" }}
          >
            <a href={BUY_URL} target="_blank" rel="noreferrer">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buy Now
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 flex-1 border-matrix/50 bg-card/60 text-matrix backdrop-blur hover:bg-matrix/10 hover:text-matrix font-bold"
          >
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
              <Send className="mr-2 h-4 w-4" />
              Join Telegram
            </a>
          </Button>
        </div>

        <p className="mt-10 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          $VSAI is a meme. nothing here is financial advice.
        </p>
      </section>
    </main>
  );
};

const BotCard = ({ side, name, tag }: { side: "tesla" | "gpt"; name: string; tag: string }) => {
  const isTesla = side === "tesla";
  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-card/60 p-4 backdrop-blur transition hover:-translate-y-0.5 md:p-6 ${
        isTesla ? "border-tesla/40 hover:glow-tesla" : "border-gpt/50 hover:glow-gpt"
      }`}
    >
      <div
        className={`absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl ${
          isTesla ? "bg-tesla/40" : "bg-gpt/40"
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
