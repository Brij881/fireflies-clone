"use client";

import {
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
} from "react";
import {
  FileText,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  createMeeting,
  createTranscript,
} from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface ParticipantInput {
  name: string;
  email: string;
}

function timestampToSeconds(value: string) {
  const parts = value.split(":").map(Number);

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return 0;
}

function parseTranscript(text: string) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const segments = lines.map((line, index) => {
    let speaker = "Speaker";
    let content = line;
    let start = index * 12;

    const timestampMatch = line.match(
      /^\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?\s*(.*)$/
    );

    if (timestampMatch) {
      start = timestampToSeconds(timestampMatch[1]);
      content = timestampMatch[2].trim();
    }

    const separator = content.indexOf(":");

    if (separator !== -1) {
      speaker = content.slice(0, separator).trim();
      content = content.slice(separator + 1).trim();
    }

    return {
      speaker: speaker || "Speaker",
      start_time: start,
      end_time: start + 12,
      text: content,
      segment_order: index + 1,
    };
  });

  return segments.map((segment, index) => ({
    ...segment,
    end_time:
      index < segments.length - 1
        ? segments[index + 1].start_time
        : segment.start_time + 12,
  }));
}

export default function CreateMeetingModal({
  open,
  onClose,
}: Props) {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("30");
  const [summary, setSummary] = useState("");
  const [transcript, setTranscript] = useState("");

  const [fileName, setFileName] = useState("");

  const [participants, setParticipants] = useState<
    ParticipantInput[]
  >([
    {
      name: "",
      email: "",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  function addParticipant() {
    setParticipants((current) => [
      ...current,
      {
        name: "",
        email: "",
      },
    ]);
  }

  function updateParticipant(
    index: number,
    field: keyof ParticipantInput,
    value: string
  ) {
    setParticipants((current) =>
      current.map((participant, currentIndex) =>
        currentIndex === index
          ? {
              ...participant,
              [field]: value,
            }
          : participant
      )
    );
  }

  function removeParticipant(index: number) {
    setParticipants((current) =>
      current.filter(
        (_, currentIndex) => currentIndex !== index
      )
    );
  }

  async function handleFile(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".txt")) {
      setError("Please upload a .txt transcript file.");
      event.target.value = "";
      return;
    }

    try {
      const text = await file.text();

      setTranscript(text);
      setFileName(file.name);
      setError("");
    } catch {
      setError("Unable to read the transcript file.");
    }
  }

  function removeFile() {
    setFileName("");
    setTranscript("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Meeting title is required.");
      return;
    }

    if (!date) {
      setError("Meeting date is required.");
      return;
    }

    const durationMinutes = Number(duration);

    if (
      Number.isNaN(durationMinutes) ||
      durationMinutes <= 0
    ) {
      setError("Enter a valid meeting duration.");
      return;
    }

    const validParticipants = participants
      .filter((participant) => participant.name.trim())
      .map((participant) => ({
        name: participant.name.trim(),
        email: participant.email.trim() || undefined,
      }));

    try {
      setLoading(true);

      const meeting = await createMeeting({
        title: title.trim(),
        meeting_date: new Date(date).toISOString(),
        duration: durationMinutes * 60,
        summary: summary.trim() || undefined,
        participants: validParticipants,
      });

      if (transcript.trim()) {
        const segments = parseTranscript(transcript);

        if (segments.length > 0) {
          await createTranscript(meeting.id, segments);
        }
      }

      onClose();

      router.push(`/meetings/${meeting.id}`);
      router.refresh();
    } catch {
      setError(
        "Unable to create meeting. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Create meeting
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add meeting details and a transcript
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={19} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >
          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Meeting title
            </label>

            <input
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Weekly Product Sync"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Date
              </label>

              <input
                type="datetime-local"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Duration
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(event) =>
                    setDuration(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-16 text-sm outline-none focus:border-violet-400"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  minutes
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Summary
            </label>

            <textarea
              value={summary}
              onChange={(event) =>
                setSummary(event.target.value)
              }
              rows={3}
              placeholder="What was discussed in this meeting?"
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                Participants
              </label>

              <button
                type="button"
                onClick={addParticipant}
                className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700"
              >
                <Plus size={14} />
                Add participant
              </button>
            </div>

            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr_auto] gap-2"
                >
                  <input
                    value={participant.name}
                    onChange={(event) =>
                      updateParticipant(
                        index,
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="Name"
                    className="min-w-0 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                  />

                  <input
                    value={participant.email}
                    onChange={(event) =>
                      updateParticipant(
                        index,
                        "email",
                        event.target.value
                      )
                    }
                    placeholder="Email (optional)"
                    className="min-w-0 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeParticipant(index)
                    }
                    disabled={participants.length === 1}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                Transcript
              </label>

              <span className="text-xs text-slate-400">
                Paste or upload
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,text/plain"
              onChange={handleFile}
              className="hidden"
            />

            {!fileName ? (
              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="mb-3 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-5 text-sm text-slate-500 transition hover:border-violet-300 hover:bg-violet-50/40 hover:text-violet-600"
              >
                <Upload size={19} />

                <div className="text-left">
                  <p className="font-medium">
                    Upload transcript
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    TXT files supported
                  </p>
                </div>
              </button>
            ) : (
              <div className="mb-3 flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50/50 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                  <FileText size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-700">
                    {fileName}
                  </p>

                  <p className="text-xs text-slate-400">
                    Transcript loaded
                  </p>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <textarea
              value={transcript}
              onChange={(event) => {
                setTranscript(event.target.value);

                if (fileName) {
                  setFileName("");
                }
              }}
              rows={8}
              placeholder={`Alex: Thanks everyone for joining.
Sarah: Let's review the launch timeline.
David: Testing is almost complete.`}
              className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 font-mono text-sm leading-6 outline-none focus:border-violet-400"
            />

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Use one segment per line. Supported formats include
              &quot;Speaker: text&quot; and
              &quot;[00:15] Speaker: text&quot;.
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex min-w-36 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create meeting
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}