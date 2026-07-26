"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import CreateMeetingModal from "./CreateMeetingModal";

export default function MeetingActions() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
      >
        <Plus size={17} />
        New meeting
      </button>

      <CreateMeetingModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}