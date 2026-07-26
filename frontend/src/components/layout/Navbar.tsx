import { Bell, HelpCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-end border-b border-slate-200 bg-white px-8">
      <div className="flex items-center gap-5">
        <button className="text-slate-500">
          <HelpCircle size={20} />
        </button>

        <button className="text-slate-500">
          <Bell size={20} />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
          BP
        </div>
      </div>
    </header>
  );
}