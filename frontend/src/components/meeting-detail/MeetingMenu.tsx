"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { deleteMeeting } from "@/lib/api";
import { Meeting } from "@/lib/types";
import EditMeetingModal from "./EditMeetingModal";

interface Props {
  meeting: Meeting;
}

export default function MeetingMenu({ meeting }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this meeting?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await deleteMeeting(meeting.id);

      router.push("/");
      router.refresh();
    } catch {
      alert("Unable to delete meeting.");
      setDeleting(false);
    }
  }

  function handleEdit() {
    setOpen(false);
    setEditing(true);
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
          aria-label="Meeting options"
        >
          <MoreHorizontal size={19} />
        </button>

        {open && (
          <div className="absolute right-0 top-11 z-30 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
            <button
              onClick={handleEdit}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50"
            >
              <Pencil size={16} />
              Edit meeting
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={16} />

              {deleting ? "Deleting..." : "Delete meeting"}
            </button>
          </div>
        )}
      </div>

      <EditMeetingModal
        meeting={meeting}
        open={editing}
        onClose={() => setEditing(false)}
      />
    </>
  );
}