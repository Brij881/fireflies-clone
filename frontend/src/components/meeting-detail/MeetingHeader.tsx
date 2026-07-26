import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react";

import { Meeting } from "@/lib/types";
import MeetingMenu from "./MeetingMenu";

interface Props {
  meeting: Meeting;
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  return `${hours}h ${remaining}m`;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MeetingHeader({ meeting }: Props) {
  const date = new Date(meeting.meeting_date);

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-5 lg:px-8">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="truncate text-xl font-semibold text-slate-900 lg:text-2xl">
              {meeting.title}
            </h1>

            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <CheckCircle2 size={13} />
              Processed
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={15} />

              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock size={15} />
              {formatDuration(meeting.duration)}
            </span>

            <span className="flex items-center gap-1.5">
              <Users size={15} />
              {meeting.participants.length} participants
            </span>
          </div>

          {meeting.participants.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {meeting.participants.map((participant) => (
                <div
                  key={participant.id}
                  title={participant.name}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-[10px] font-semibold text-violet-700">
                    {initials(participant.name)}
                  </div>

                  <span className="text-xs text-slate-600">
                    {participant.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <MeetingMenu meeting={meeting} />
      </div>
    </header>
  );
}