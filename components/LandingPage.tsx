import Link from "next/link";
import { ArrowRight, Download, Layers3, Palette, Sparkles, Wand2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const features = [
  {
    icon: Sparkles,
    title: "Instant preview",
    description: "See the styled result update as you type, drag, and tune the layout.",
  },
  {
    icon: Palette,
    title: "Custom backgrounds",
    description: "Use solid, gradient, or glass-style backgrounds that feel premium.",
  },
  {
    icon: Download,
    title: "Social-ready export",
    description: "Export clean PNGs sized for sharing on X, LinkedIn, and product launches.",
  },
];

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.25),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.2),transparent_22%),radial-gradient(circle_at_50%_110%,rgba(236,72,153,0.16),transparent_24%),linear-gradient(180deg,#050816_0%,#0a1020_55%,#050816_100%)]" />
      <Navbar />

      <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-24">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
            <Wand2 className="h-4 w-4 text-fuchsia-300" />
            Create beautiful content in seconds
          </div>
          <h1 className="max-w-xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Turn your screenshots into viral content
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
            Create beautiful, shareable images in seconds with a fast editor built for screenshots, code, and launch-ready visuals.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/editor" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(168,85,247,0.35)] transition hover:translate-y-[-1px] hover:brightness-110">
              Start Creating <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#demo" className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
              View Demo
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span className="flex -space-x-2">
                {["A", "B", "C", "D"].map((label) => (
                  <span key={label} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs font-semibold text-white">
                    {label}
                  </span>
                ))}
              </span>
              Loved by creators and developers
            </div>
          </div>
        </div>

        <div id="demo" className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-6">
          <div className="grid gap-4 rounded-[24px] border border-white/10 bg-slate-950/55 p-4 sm:grid-cols-2">
            <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4">
              <div className="mb-3 text-xs uppercase tracking-[0.24em] text-slate-400">Original</div>
              <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">Alex Banks</p>
                <p className="mt-3">Just shipped my new SaaS!</p>
                <p className="mt-2 text-cyan-300">#buildinpublic</p>
              </div>
            </div>
            <div className="rounded-[22px] border border-fuchsia-400/30 bg-gradient-to-br from-fuchsia-500/80 via-violet-500/80 to-cyan-500/80 p-4 shadow-[0_20px_60px_rgba(168,85,247,0.35)]">
              <div className="mb-3 text-xs uppercase tracking-[0.24em] text-white/70">Beautiful</div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-white backdrop-blur-sm">
                <p className="font-semibold">Alex Banks</p>
                <p className="mt-3">Just shipped my new SaaS!</p>
                <p className="mt-2 text-cyan-100">#buildinpublic</p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <Icon className="h-5 w-5 text-fuchsia-300" />
                <h3 className="mt-3 text-sm font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:col-span-2">
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
              <Layers3 className="h-4 w-4 text-cyan-300" /> Full editor workflow
            </div>
            <p className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">Landing page, editor, customize, export, and share in one polished experience.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Upload screenshots", "Paste or drag in any image"],
                ["Paste code", "Syntax-aware code mode"],
                ["Style controls", "Backgrounds, padding, shadow"],
                ["Export fast", "One-click PNG download"],
              ].map(([title, detail]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="text-sm font-semibold text-white">{title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-400">{detail}</div>
                </div>
              ))}
            </div>
          </div>
          <div id="pricing" className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur-xl">
            <div className="text-sm uppercase tracking-[0.28em] text-slate-400">Pricing</div>
            <p className="mt-3 text-2xl font-semibold">Free MVP, premium-ready architecture.</p>
            <p className="mt-4 text-sm leading-6 text-slate-400">Add high-res export, brand presets, and watermark removal when you are ready to monetize.</p>
            <Link href="/editor" className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Open Editor
            </Link>
          </div>
        </div>
      </section>

      <footer id="footer" className="border-t border-white/10 bg-slate-950/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>ContentIo. Build visual content fast.</p>
          <div className="flex gap-6">
            <a href="mailto:hello@contentio.dev" className="transition hover:text-white">
              Contact
            </a>
            <a href="#features" className="transition hover:text-white">
              About
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
