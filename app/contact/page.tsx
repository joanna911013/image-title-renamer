import type { Metadata } from "next";

const contactDetails = [
  {
    title: "Email",
    value: "hello@clearcapture.example.com",
    href: "mailto:hello@clearcapture.example.com",
  },
  {
    title: "Phone",
    value: "+1 (312) 555-0112",
    href: "tel:+13125550112",
  },
  {
    title: "Office hours",
    value: "Monday – Friday, 9am to 5pm CT",
  },
];

export const metadata: Metadata = {
  title: "Contact",
  description: "Send us an inquiry about tailoring ClearCapture to your workflow.",
};

export default function ContactPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[3fr,2fr]">
      <section className="section-card">
        <div className="space-y-6">
          <div>
            <h1 className="section-title">Start a conversation</h1>
            <p className="section-subtitle">
              Share a few details about your screenshot management needs and our team will respond within one business day with a calm, thorough plan of action.
            </p>
          </div>
          <form className="grid gap-6 md:grid-cols-2" action="#" method="post">
            <div className="md:col-span-1">
              <label htmlFor="name" className="block text-sm font-semibold text-brand-700">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-2 w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-brand-300 focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="email" className="block text-sm font-semibold text-brand-700">
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-2 w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-brand-300 focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="company" className="block text-sm font-semibold text-brand-700">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                className="mt-2 w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-brand-300 focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="teamSize" className="block text-sm font-semibold text-brand-700">
                Team size
              </label>
              <select
                id="teamSize"
                name="teamSize"
                className="mt-2 w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-brand-300 focus:ring-2 focus:ring-brand-200"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a range
                </option>
                <option value="1-5">1 – 5</option>
                <option value="6-20">6 – 20</option>
                <option value="21-50">21 – 50</option>
                <option value="50+">50+</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="message" className="block text-sm font-semibold text-brand-700">
                How can we help?
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="mt-2 w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-brand-300 focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <fieldset className="md:col-span-2 space-y-3">
              <legend className="text-sm font-semibold text-brand-700">What matters most?</legend>
              <label className="flex items-start gap-3 text-sm text-slate-600">
                <input type="checkbox" name="priorities" value="privacy" className="mt-1 h-4 w-4 rounded border-brand-200 text-brand-600 focus:ring-brand-200" />
                Privacy compliance and audit readiness
              </label>
              <label className="flex items-start gap-3 text-sm text-slate-600">
                <input type="checkbox" name="priorities" value="automation" className="mt-1 h-4 w-4 rounded border-brand-200 text-brand-600 focus:ring-brand-200" />
                Automation and workflow integrations
              </label>
              <label className="flex items-start gap-3 text-sm text-slate-600">
                <input type="checkbox" name="priorities" value="llm" className="mt-1 h-4 w-4 rounded border-brand-200 text-brand-600 focus:ring-brand-200" />
                Language model enhancements
              </label>
            </fieldset>
            <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-3 text-xs text-slate-500">
                <input type="checkbox" name="newsletter" className="h-4 w-4 rounded border-brand-200 text-brand-600 focus:ring-brand-200" />
                Keep me informed about new capabilities.
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-500"
              >
                Send inquiry
              </button>
            </div>
          </form>
        </div>
      </section>

      <aside className="section-card space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-brand-700">Prefer a direct touchpoint?</h2>
          <p className="mt-2 text-sm text-slate-600">
            Choose the channel that suits your schedule and we will respond with the same calm clarity that guides the product.
          </p>
        </div>
        <ul className="space-y-4 text-sm text-slate-600">
          {contactDetails.map((detail) => (
            <li key={detail.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">{detail.title}</p>
              {detail.href ? (
                <a href={detail.href} className="mt-1 block text-base font-semibold text-brand-700 transition-colors hover:text-brand-600">
                  {detail.value}
                </a>
              ) : (
                <p className="mt-1 text-base font-semibold text-brand-700">{detail.value}</p>
              )}
            </li>
          ))}
        </ul>
        <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5 text-xs text-slate-500">
          We tailor each engagement, so feel free to include security requirements, preferred storage providers, or sample screenshots. The more detail we receive, the faster we can craft a confident roadmap.
        </div>
      </aside>
    </div>
  );
}
