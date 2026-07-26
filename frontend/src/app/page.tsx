import { Filter, Search, SlidersHorizontal } from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import MeetingCard from "@/components/meetings/MeetingCard";
import { getMeetings } from "@/lib/api";
import MeetingActions from "@/components/meetings/MeetingActions";

export default async function Home() {
  const meetings = await getMeetings();

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Meetings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review your meetings, transcripts and notes
            </p>
          </div>

          <MeetingActions />
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              placeholder="Search meetings..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-400"
            />
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600">
              <Filter size={16} />
              Filter
            </button>

            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600">
              <SlidersHorizontal size={16} />
              Recent
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">
              My meetings
            </h2>

            <span className="text-sm text-slate-500">
              {meetings.length} meetings
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {meetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
              />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}