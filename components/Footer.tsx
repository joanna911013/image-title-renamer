import Link from "next/link";

import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur">
      <Container className="flex flex-col gap-6 py-10 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-brand-700">ClearCapture</p>
          <p className="mt-1 max-w-md text-xs text-slate-500">
            A calm, trustworthy toolkit for teams who need reliable screenshot organization.
          </p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
          <Link href="/contact" className="transition-colors hover:text-brand-600">
            Contact
          </Link>
          <a
            href="https://example.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-brand-600"
          >
            Privacy
          </a>
          <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} ClearCapture. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
