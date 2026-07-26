"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Home,
  ListVideo,
  Puzzle,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";

const navigation = [
  {
    name: "Home",
    icon: Home,
    href: "/",
  },
  {
    name: "Meetings",
    icon: ListVideo,
    href: "/",
  },
  {
    name: "AI Apps",
    icon: Sparkles,
    href: "#",
  },
  {
    name: "Integrations",
    icon: Puzzle,
    href: "#",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="flex h-16 items-center border-b border-slate-100 px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
            F
          </div>

          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Fireflies
          </span>
        </Link>
      </div>

      <div className="px-3 py-4">
        <button className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-400 transition hover:border-slate-300">
          <Search size={16} />
          Search
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            item.name === "Meetings" &&
            (pathname === "/" ||
              pathname.startsWith("/meetings"));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-6">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50">
            <CalendarDays size={18} />
            Calendar
          </button>
        </div>
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50">
          <Settings size={18} />
          Settings
        </button>
      </div>
    </aside>
  );
}