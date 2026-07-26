import AppShell from "@/components/layout/AppShell";
import MeetingActions from "@/components/meetings/MeetingActions";
import MeetingDashboard from "@/components/meetings/MeetingDashboard";
import { getMeetings } from "@/lib/api";

export default async function Home() {
  const meetings = await getMeetings();

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

        <MeetingDashboard meetings={meetings} />
      </div>
    </AppShell>
  );
}