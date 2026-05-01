import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Download,
  Layers3,
  Palette,
  Wand2,
  Zap,
  Shield,
  HeartHandshake,
  Star,
  Code2,
  ImagePlus,
  Share2,
  Cpu,
  Globe,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { LoadingLink } from "@/components/LoadingLink";
import favicon from "@/app/assets/Favicon.png";

// ─── Data ────────────────────────────────────────────────────────────────────

interface Feature {
  isImage?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  iconColor: string;
}

const features: Feature[] = [
  {
    isImage: true,
    title: "Instant live preview",
    description: "Every tweak — padding, shadow, font size — reflects immediately. No refresh, no lag.",
    color: "from-fuchsia-500/20 to-violet-500/10",
    iconColor: "text-fuchsia-300",
  },
  {
    icon: Palette,
    title: "Premium backgrounds",
    description: "Aurora, sunset, graphite, and glass-morphic backdrops that make your content pop.",
    color: "from-cyan-500/20 to-blue-500/10",
    iconColor: "text-cyan-300",
  },
  {
    icon: Download,
    title: "Social-ready export",
    description: "One-click 2× or 3× HD PNG export. Sized perfectly for X, LinkedIn, and Product Hunt.",
    color: "from-violet-500/20 to-indigo-500/10",
    iconColor: "text-violet-300",
  },
  {
    icon: Code2,
    title: "Code card mode",
    description: "Syntax-highlighted code in JavaScript, TypeScript, Python, Bash, Java, and C++ with line numbers.",
    color: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-300",
  },
  {
    icon: ImagePlus,
    title: "Screenshot mode",
    description: "Drag-and-drop any image. Add glass frames, shadows, and branded backgrounds in seconds.",
    color: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-300",
  },
  {
    icon: Share2,
    title: "Share & embed",
    description: "Public shareable link or embeddable iframe. Your designs, accessible anywhere.",
    color: "from-pink-500/20 to-rose-500/10",
    iconColor: "text-pink-300",
  },
];

const workflow = [
  { step: "01", title: "Upload or paste", detail: "Drop a screenshot or paste your code snippet." },
  { step: "02", title: "Customize", detail: "Adjust background, padding, shadow, theme, and font." },
  { step: "03", title: "Preview live", detail: "See the final result in real time as you edit." },
  { step: "04", title: "Export & share", detail: "Download HD PNG or share a public link instantly." },
];

const testimonials = [
  {
    name: "Priya Sharma",
    handle: "@priya_builds",
    avatar: "PS",
    text: "contentIo is the first tool that made my code screenshots actually look good. Been using it every day for my build-in-public posts.",
    stars: 5,
  },
  {
    name: "Marcus Lee",
    handle: "@marcuslee_dev",
    avatar: "ML",
    text: "Replaced three separate tools with this. The glass background preset alone is worth it — looks stunning on LinkedIn.",
    stars: 5,
  },
  {
    name: "Ananya Iyer",
    handle: "@ananyaships",
    avatar: "AI",
    text: "Ship screenshots that look like marketing assets. That's the pitch. It's 100% accurate.",
    stars: 5,
  },
];

const faqs = [
  {
    q: "Can I use contentIo for free?",
    a: "Yes — contentIo is free to use. Exports include a small contentIo watermark by default.",
  },
  {
    q: "What export formats are supported?",
    a: "PNG export is available now. Additional formats (SVG, PDF, HTML) are planned.",
  },
  {
    q: "Can I remove the watermark?",
    a: "Supporters can remove the watermark — see the Support section to learn more.",
  },
  {
    q: "Is there an API?",
    a: "API access is planned for teams; follow the changelog for availability.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* Background mesh */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-violet-400/15 dark:bg-violet-400/10 blur-[120px]" />
        <div className="absolute -top-20 right-1/4 h-[500px] w-[500px] rounded-full bg-cyan-400/10 dark:bg-cyan-400/5 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-fuchsia-400/10 dark:bg-fuchsia-400/5 blur-[100px]" />
        <div className="landing-vignette absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,#f8fafc_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_60%,#0f172a_100%)]" />
        {/* Grid */}
        <div
          className="landing-grid-overlay absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <Navbar forceLightTheme />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-24">
        <div>
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-slate-900/50 backdrop-blur-sm">
            <img src={favicon.src} alt="ContentIo logo" className="h-3.5 w-3.5 object-contain" />
            <span>The editor for screenshots and code</span>
            <span className="ml-1 h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-600" />
            <span className="text-fuchsia-600 dark:text-fuchsia-400">Free forever</span>
          </div>

          <h1 className="font-display max-w-xl text-5xl font-semibold leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-[68px]">
            Ship stunning{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                code + content
              </span>
              <span className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-fuchsia-400/50 to-cyan-400/50" />
            </span>{" "}
            in minutes
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-300">
            Beautiful editor for screenshots and code snippets. Customize backgrounds, add syntax highlighting, adjust layouts — then export HD images ready for social media.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LoadingLink
              href="/editor"
              loadingLabel="Opening..."
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-slate-900/50 transition hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <img src={favicon.src} alt="ContentIo logo" className="h-4 w-4 object-contain" />
              Open Editor
            </LoadingLink>
            <a
              href="#demo"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-slate-900/50 backdrop-blur transition hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              View live demo
            </a>
          </div>

          {/* Social proof strip */}
          <div className="mt-10 flex flex-wrap items-center gap-5 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["PS", "ML", "AK", "RJ", "NB"].map((label, i) => (
                  <span
                    key={label}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-violet-500/40 to-cyan-500/40 text-[10px] font-semibold text-slate-900 dark:text-white"
                    style={{ zIndex: 5 - i }}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <span>
                <strong className="font-semibold text-slate-900 dark:text-white">2,400+</strong> creators
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-1">4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              No credit card needed
            </div>
          </div>
        </div>

        {/* Hero demo card */}
        <div
          id="demo"
          className="relative rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-5"
        >
          {/* Decorative glow */}
          <div className="absolute -inset-px -z-10 rounded-[28px] bg-gradient-to-br from-fuchsia-500/20 via-transparent to-cyan-500/20 dark:from-fuchsia-500/10 dark:to-cyan-500/10 blur-sm" />

          <div className="mb-3 flex items-center gap-2 px-1">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <span className="ml-2 text-[11px] text-slate-500 dark:text-slate-400">contentio — editor</span>
          </div>

          <div className="grid gap-3 rounded-[20px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm dark:shadow-none">
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Your screenshot
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-700 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-white">Alex Banks</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">@alexbanks · 2h ago</p>
                <p className="mt-3 leading-6">Just shipped my new SaaS! 🚀</p>
                <p className="mt-1 text-cyan-600 dark:text-cyan-400">#buildinpublic #indiehacker</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-fuchsia-400/20 dark:border-fuchsia-400/30 bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-500 p-4 shadow-[0_20px_60px_rgba(168,85,247,0.25)] dark:shadow-[0_20px_60px_rgba(168,85,247,0.15)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/75">
                contentIo magic ✦
              </div>
              <div className="relative rounded-xl border border-white/20 bg-white/10 p-4 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-sm">
                <p className="font-semibold">Alex Banks</p>
                <p className="mt-2 text-xs text-white/50">@alexbanks · 2h ago</p>
                <p className="mt-3 leading-6">Just shipped my new SaaS! 🚀</p>
                <p className="mt-1 text-cyan-100">#buildinpublic #indiehacker</p>
              </div>
            </div>
          </div>

          {/* Mini feature pills */}
          <div className="mt-3 flex flex-wrap gap-2">
              {["aurora bg", "glass frame", "2× HD export"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 shadow-sm dark:shadow-none"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Logos / trust strip ───────────────────────────── */}
      <section className="border-y border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            Used by builders at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-500 dark:text-slate-400">
            {["Vercel", "Supabase", "PlanetScale", "Linear", "Raycast", "Loom"].map((brand) => (
              <span key={brand} className="text-sm font-semibold tracking-wide opacity-40 grayscale filter">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features grid ────────────────────────────────── */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm dark:shadow-none">
            <Layers3 className="h-3.5 w-3.5 text-fuchsia-500" />
            Everything you need
          </div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            The complete content creation toolkit
          </h2>
          <p className="mt-4 text-slate-400 dark:text-slate-500">
            Built for developers, designers, and indie hackers who care about how their content looks.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon, isImage, title, description, color, iconColor }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 transition hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div className="relative">
                <div className={`mb-4 inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-2.5 ${iconColor}`}>
                  {isImage ? (
                    <img src={favicon.src} alt="ContentIo logo" className="h-5 w-5 object-contain" />
                  ) : icon && React.createElement(icon, { className: "h-5 w-5" })}
                </div>
                <h3 className="mb-2 text-[15px] font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="border-y border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Ready in under 60 seconds
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">No learning curve. Just open, paste, style, export.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map(({ step, title, detail }, i) => (
              <div key={step} className="relative">
                {i < workflow.length - 1 && (
                  <div className="absolute left-[calc(50%+40px)] top-8 hidden h-px w-[calc(100%-80px)] bg-gradient-to-r from-slate-200 dark:from-slate-700 to-transparent lg:block" />
                )}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-none">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400 ring-1 ring-slate-200 dark:ring-slate-700">
                    {step}
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder Story ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-sm dark:shadow-none sm:p-10">
          <p className="mb-3 inline-flex rounded-full border border-violet-200 dark:border-violet-900 bg-violet-50 dark:bg-violet-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
            Why I Built ContentIo
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Started after a failed SaaS</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            I was previously building a SaaS to convert code into animated visualizations. The idea was exciting, but the product was too complex and I failed to get real traction.
            While sharing progress online, I noticed one repeated problem: even good code looked boring in screenshots. So I pivoted and built ContentIo to solve that one problem really well.
            Fast styling, clean exports, and visuals that are ready to post.
          </p>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Creators love contentIo
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Join thousands of builders shipping beautiful content.</p>
        </div>

        {/* Testimonials removed per request (no public review system) */}
      </section>

      {/* ── Support ──────────────────────────────────────── */}
      <section id="support" className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-cyan-200 dark:border-cyan-900 bg-white dark:bg-slate-800 p-8 text-center shadow-[0_20px_80px_rgba(15,23,42,0.08)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.3)] sm:p-12">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 dark:border-cyan-900 bg-cyan-50 dark:bg-cyan-950 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
              <HeartHandshake className="h-3.5 w-3.5" />
              Support ContentIo
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              No paid wall right now. Support is optional.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
              We are keeping ContentIo free for everyone while we improve the editor. If you want to push us ahead faster, you can support the project with any amount.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="/api/support/create-checkout"
                className="support-action inline-flex items-center gap-2 rounded-2xl border border-cyan-300/60 dark:border-cyan-700 bg-cyan-100 dark:bg-cyan-950 px-7 py-3.5 text-sm font-semibold text-cyan-800 dark:text-cyan-200 shadow-[0_14px_40px_rgba(34,211,238,0.22)] dark:shadow-[0_14px_40px_rgba(34,211,238,0.08)] transition hover:brightness-105 dark:hover:brightness-110"
              >
                <HeartHandshake className="h-4 w-4" />
                Support via Polar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI teaser ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-xs font-medium text-fuchsia-300">
                <Cpu className="h-3 w-3" />
                Coming soon — AI Features
              </div>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Let AI style your content for you
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
                Describe the vibe — "make it look like a Vercel launch post" — and our AI picks the perfect background, padding, shadow, and font combination. One prompt, pixel-perfect result.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Auto-style from prompt", "Background generator", "Caption writer", "A/B export variants"].map((tag) => (
                  <span key={tag} className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-xs text-fuchsia-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <LoadingLink
              href="/editor"
              loadingLabel="Joining..."
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(168,85,247,0.4)] transition hover:brightness-110"
            >
              <Globe className="h-4 w-4" />
              Join the waitlist
            </LoadingLink>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display mb-12 text-center text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Frequently asked
          </h2>
          <div className="flex flex-col divide-y divide-slate-200 dark:divide-slate-700">
               {[
                 {
                   q: "Can I use contentIo for free?",
                   a: "Yes — contentIo is free to use. Exports include a small contentIo watermark by default.",
                 },
                 {
                   q: "What export formats are supported?",
                   a: "PNG export is available now. Additional formats (SVG, PDF, HTML) are planned.",
                 },
                 {
                   q: "Can I remove the watermark?",
                   a: "Supporters can remove the watermark — see the Support section to learn more.",
                 },
                 {
                   q: "Is there an API?",
                   a: "API access is planned for teams; follow the changelog for availability.",
                 },
               ].map(({ q, a }) => (
                 <details key={q} className="group py-5">
                   <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-slate-900 dark:text-white">
                     {q}
                     <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500 transition-transform group-open:rotate-180" />
                   </summary>
                   <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">{a}</p>
                 </details>
               ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900 py-24">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Start creating beautiful content today
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Free forever. No credit card. Just stunning visuals in seconds.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LoadingLink
              href="/editor"
              loadingLabel="Opening..."
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-8 py-4 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(168,85,247,0.45)] transition hover:brightness-110"
            >
              <img src={favicon.src} alt="ContentIo logo" className="h-4 w-4 object-contain" />
              Open the editor — it's free
              <ArrowRight className="h-4 w-4" />
            </LoadingLink>
          </div>
          <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">
            Joined by 2,400+ creators. No spam, ever.
          </p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer id="footer" className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400">
                  <img src={favicon.src} alt="ContentIo logo" className="h-4 w-4 object-contain" />
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">contentIo</span>
              </div>
              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-400">
                The fastest way to turn screenshots and code snippets into shareable, polished visuals.
              </p>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Product</p>
              <ul className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-400">
                {["Editor", "Templates", "Support", "Changelog"].map((item) => (
                  <li key={item}><a href="#" className="transition hover:text-slate-900 dark:hover:text-white">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Company</p>
              <ul className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-400">
                {["About", "Blog", "Privacy", "Terms"].map((item) => (
                  <li key={item}><a href="#" className="transition hover:text-slate-900 dark:hover:text-white">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-700 pt-8 text-xs text-slate-500 dark:text-slate-400 sm:flex-row">
            <p>© 2025 contentIo. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="mailto:hello@contentio.dev" className="transition hover:text-slate-700 dark:hover:text-slate-200">Contact</a>
              <a href="#" className="transition hover:text-slate-700 dark:hover:text-slate-200">Twitter / X</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}