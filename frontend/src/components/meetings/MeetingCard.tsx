import Link from "next/link";
import { Clock, Users } from "lucide-react";

import { Meeting } from "@/lib/types";

interface Props {
  meeting: Meeting;
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}

export default function MeetingCard({ meeting }: Props) {
  const date = new Date(meeting.meeting_date);

  return (
    <Link href={`/meetings/${meeting.id}`}>
      <article className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-violet-200 hover:shadow-sm">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              {meeting.title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
            Processed
          </span>
        </div>

        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-slate-600">
          {meeting.summary ?? "No summary available."}
        </p>

        <div className="mt-5 flex items-center gap-5 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {formatDuration(meeting.duration)}
          </span>

          <span className="flex items-center gap-1.5">
            <Users size={14} />
            {meeting.participants.length} participants
          </span>
        </div>
      </article>
    </Link>
  );
}