import { CheckCircle2, ListChecks, Sparkles } from "lucide-react";
import ActionItemsPanel from "./ActionItemsPanel";
import { ActionItem, Meeting, Topic } from "@/lib/types";

interface Props {
  meeting: Meeting;
  actionItems: ActionItem[];
  topics: Topic[];
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);

  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export default function SummaryPanel({
  meeting,
  actionItems,
  topics,
}: Props) {
  return (
    <div className="space-y-8 p-6">
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={18} className="text-violet-600" />

          <h2 className="font-semibold text-slate-900">
            Meeting overview
          </h2>
        </div>

        <p className="text-sm leading-6 text-slate-600">
          {meeting.summary ?? "No summary available."}
        </p>
      </section>

      <ActionItemsPanel meetingId={meeting.id} initialItems={actionItems}/>

      <section>
        <h2 className="mb-4 font-semibold text-slate-900">
          Topics discussed
        </h2>

        <div className="space-y-4">
          {topics.map((topic) => (
            <div key={topic.id} className="flex gap-3">
              <span className="mt-0.5 text-xs font-medium text-violet-600">
                {formatTime(topic.start_time)}
              </span>

              <div>
                <p className="text-sm font-medium text-slate-700">
                  {topic.title}
                </p>

                {topic.description && (
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {topic.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}