"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

import { Container } from "./Container";

type NavItem = {
  href: string;
  label: string;
  description: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", description: "Overview of ClearCapture" },
  { href: "/contact", label: "Contact", description: "Start an inquiry" },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((open) => !open);
  const close = () => setIsOpen(false);

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-semibold text-brand-700">
            ClearCapture
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "rounded-full px-4 py-2 transition-colors hover:bg-brand-50 hover:text-brand-600",
                    active && "bg-brand-50 text-brand-600"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          type="button"
          className="rounded-md p-2 text-slate-500 transition-colors hover:text-brand-600 lg:hidden"
          onClick={toggle}
          aria-label="Toggle navigation"
        >
          {isOpen ? <XMarkIcon aria-hidden className="h-6 w-6" /> : <Bars3Icon aria-hidden className="h-6 w-6" />}
        </button>
      </Container>
      {isOpen ? (
        <div className="border-t border-slate-200 bg-white/95 backdrop-blur-sm lg:hidden">
          <Container className="py-4">
            <nav className="flex flex-col gap-2 text-sm font-medium text-slate-600">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className={clsx(
                      "rounded-xl px-4 py-3 transition-colors hover:bg-brand-50 hover:text-brand-600",
                      active && "bg-brand-50 text-brand-600"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="font-semibold">{item.label}</span>
                    <span className="mt-1 block text-xs font-normal text-slate-500">{item.description}</span>
                  </Link>
                );
              })}
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
