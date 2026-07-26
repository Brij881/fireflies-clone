"use client";

import { useState } from "react";
import {
  FileText,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

import { ActionItem, Meeting, Topic, TranscriptSegment } from "@/lib/types";
import MeetingWorkspace from "./MeetingWorkspace";
import SummaryPanel from "./SummaryPanel";

interface Props {
  meeting: Meeting;
  transcript: TranscriptSegment[];
  actionItems: ActionItem[];
  topics: Topic[];
}

type Tab = "summary" | "transcript";

export default function MeetingDetailContent({
  meeting,
  transcript,
  actionItems,
  topics,
}: Props) {
  const [tab, setTab] = useState<Tab>("summary");

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="border-b border-slate-200 px-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setTab("summary")}
            className={`flex items-center gap-2 border-b-2 py-4 text-sm font-medium transition ${
              tab === "summary"
                ? "border-violet-600 text-violet-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles size={16} />
            AI Summary
          </button>

          <button
            onClick={() => setTab("transcript")}
            className={`flex items-center gap-2 border-b-2 py-4 text-sm font-medium transition ${
              tab === "transcript"
                ? "border-violet-600 text-violet-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquareText size={16} />
            Transcript

            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
              {transcript.length}
            </span>
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {tab === "summary" ? (
          <div className="grid h-full min-h-0 lg:grid-cols-[46%_54%]">
            <div className="overflow-y-auto border-r border-slate-200">
              <SummaryPanel
                meeting={meeting}
                actionItems={actionItems}
                topics={topics}
              />
            </div>

            <div className="hidden min-h-0 flex-col lg:flex">
              <MeetingWorkspace
                transcript={transcript}
                duration={meeting.duration}
              />
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-full min-h-0 max-w-5xl flex-col">
            <MeetingWorkspace
              transcript={transcript}
              duration={meeting.duration}
            />
          </div>
        )}
      </div>
    </div>
  );
}