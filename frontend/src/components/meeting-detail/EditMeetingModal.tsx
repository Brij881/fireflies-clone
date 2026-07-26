"use client";

import { FormEvent, useState } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { updateMeeting } from "@/lib/api";
import { Meeting } from "@/lib/types";

interface Props {
  meeting: Meeting;
  open: boolean;
  onClose: () => void;
}

interface ParticipantInput {
  name: string;
  email: string;
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);

  const offset = date.getTimezoneOffset();
  const local = new Date(
    date.getTime() - offset * 60 * 1000
  );

  return local.toISOString().slice(0, 16);
}

export default function EditMeetingModal({
  meeting,
  open,
  onClose,
}: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(meeting.title);
  const [date, setDate] = useState(
    toDateTimeLocal(meeting.meeting_date)
  );
  const [duration, setDuration] = useState(
    String(Math.round(meeting.duration / 60))
  );
  const [summary, setSummary] = useState(
    meeting.summary ?? ""
  );

  const [participants, setParticipants] = useState<
    ParticipantInput[]
  >(
    meeting.participants.map((participant) => ({
      name: participant.name,
      email: participant.email ?? "",
    }))
  );

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

  function removeParticipant(index: number) {
    setParticipants((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function updateParticipant(
    index: number,
    field: keyof ParticipantInput,
    value: string
  ) {
    setParticipants((current) =>
      current.map((participant, i) =>
        i === index
          ? {
              ...participant,
              [field]: value,
            }
          : participant
      )
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Meeting title is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updateMeeting(meeting.id, {
        title: title.trim(),
        meeting_date: new Date(date).toISOString(),
        duration: Number(duration) * 60,
        summary: summary.trim(),
        participants: participants
          .filter((participant) => participant.name.trim())
          .map((participant) => ({
            name: participant.name.trim(),
            email: participant.email.trim() || undefined,
          })),
      });

      onClose();
      router.refresh();
    } catch {
      setError("Unable to update meeting.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Edit meeting
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update meeting information
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Title
            </label>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Date
              </label>

              <input
                type="datetime-local"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Duration
              </label>

              <input
                type="number"
                min="1"
                value={duration}
                onChange={(event) =>
                  setDuration(event.target.value)
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Summary
            </label>

            <textarea
              rows={4}
              value={summary}
              onChange={(event) =>
                setSummary(event.target.value)
              }
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
                className="flex items-center gap-1 text-xs font-medium text-violet-600"
              >
                <Plus size={14} />
                Add
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
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
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
                    placeholder="Email"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => removeParticipant(index)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex min-w-32 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}