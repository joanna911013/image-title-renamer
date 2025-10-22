import Link from "next/link";
import {
  DocumentMagnifyingGlassIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    title: "Guided renaming",
    description:
      "Pair OCR highlights with confident language suggestions so every filename feels intentional and trustworthy.",
    icon: SparklesIcon,
  },
  {
    title: "Precision OCR",
    description:
      "Blend Azure and Google vision services for dependable extraction, even from layered UI captures and complex layouts.",
    icon: DocumentMagnifyingGlassIcon,
  },
  {
    title: "Privacy tooling",
    description:
      "Apply configurable masking and audit-ready logs that keep personally identifiable information out of your archives.",
    icon: ShieldCheckIcon,
  },
];

const workflow = [
  {
    title: "Upload & detect",
    description: "Drop a capture into ClearCapture and watch OCR surface the essential context within seconds.",
  },
  {
    title: "Curate keywords",
    description: "Review suggested language or tailor your own, ensuring each filename mirrors the story in the screenshot.",
  },
  {
    title: "Publish with confidence",
    description: "Ship to shared drives or archives with clean timestamps, consistent patterns, and privacy guardrails built in.",
  },
];

const faqs = [
  {
    question: "Can ClearCapture run without an LLM?",
    answer:
      "Absolutely. The OCR output and smart defaults produce meaningful filenames on their own, and you can enable the LLM layer for additional polish when credentials are available.",
  },
  {
    question: "How is sensitive data handled?",
    answer:
      "Choose between basic and strict masking modes. Both redact personally identifiable information before storage so your compliance and security teams stay confident.",
  },
  {
    question: "Will it fit existing workflows?",
    answer:
      "Yes. Configure storage targets, rename conventions, and notifications to match your preferred process with minimal setup time.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-20 pb-10">
      <section className="section-card overflow-hidden">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
          <div className="lg:flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-500">Screenshot → Smart Filename</p>
            <h1 className="section-title mt-4 text-balance">
              Bring calm, trustworthy order to every screenshot archive
            </h1>
            <p className="section-subtitle">
              ClearCapture blends precise OCR, guided language, and gentle visual cues so teams can transform scattered captures into searchable narratives without sacrificing focus.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-500"
              >
                Start a project inquiry
              </Link>
              <a
                href="#workflow"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-600 transition-colors hover:border-brand-300 hover:text-brand-700"
              >
                View the workflow
              </a>
            </div>
          </div>
          <div className="lg:flex-1">
            <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-brand-100/70 via-white to-slate-100 p-8 shadow-inner">
              <div className="space-y-6 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon aria-hidden className="mt-1 h-5 w-5 text-brand-500" />
                  <div>
                    <p className="font-semibold text-brand-700">Trust-ready defaults</p>
                    <p className="mt-1 text-slate-600">
                      Calm colors, accessible contrast, and precise spacing echo the professionalism your stakeholders expect.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowTrendingUpIcon aria-hidden className="mt-1 h-5 w-5 text-brand-500" />
                  <div>
                    <p className="font-semibold text-brand-700">Frictionless adoption</p>
                    <p className="mt-1 text-slate-600">
                      Drop in the starter today and evolve it into a production workflow without rewriting foundational pieces.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ClockIcon aria-hidden className="mt-1 h-5 w-5 text-brand-500" />
                  <div>
                    <p className="font-semibold text-brand-700">Faster alignment</p>
                    <p className="mt-1 text-slate-600">
                      Shared layout, typography, and tone keep teams aligned and reduce review cycles for each enhancement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-card" id="features">
        <div className="grid gap-10 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm">
              <feature.icon aria-hidden className="h-10 w-10 text-brand-500" />
              <h2 className="mt-4 text-xl font-semibold text-brand-700">{feature.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card" id="workflow">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="lg:w-1/3">
            <h2 className="section-title">A calming workflow your team can trust</h2>
            <p className="section-subtitle">
              Every stage emphasizes clarity with gentle gradients, readable typography, and deliberate spacing designed for deep work.
            </p>
          </div>
          <ol className="flex-1 space-y-6">
            {workflow.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-brand-700">{step.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-card">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="section-title">Teams stay confident with ClearCapture</h2>
            <p className="section-subtitle">
              Product, compliance, and research groups rely on the same tone of calm credibility to make reviews faster and more transparent.
            </p>
            <blockquote className="rounded-2xl border border-brand-100 bg-brand-50/60 p-6 text-sm text-slate-600">
              “The starter helped us deliver a polished pilot in days. The cool hues and organized layout reassured our stakeholders that their screenshots were handled with care.”
            </blockquote>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-500">FAQs</h3>
            <dl className="mt-6 space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm">
                  <dt className="text-sm font-semibold text-brand-700">{faq.question}</dt>
                  <dd className="mt-2 text-sm text-slate-600">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="section-card text-center">
        <h2 className="section-title">Ready to bring order to your screenshot library?</h2>
        <p className="section-subtitle mx-auto">
          Reach out for a guided walkthrough and learn how ClearCapture can mirror your tone while accelerating delivery.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-500"
          >
            Book a discovery call
          </Link>
          <a
            href="mailto:hello@clearcapture.example.com"
            className="rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-600 transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            Email us directly
          </a>
        </div>
      </section>
    </div>
  );
}
