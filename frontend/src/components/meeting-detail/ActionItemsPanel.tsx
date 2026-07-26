"use client";

import { FormEvent, useState } from "react";
import {
  Check,
  Circle,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  createActionItem,
  deleteActionItem,
  updateActionItem,
} from "@/lib/api";
import { ActionItem } from "@/lib/types";

interface Props {
  meetingId: number;
  initialItems: ActionItem[];
}

export default function ActionItemsPanel({
  meetingId,
  initialItems,
}: Props) {
  const [items, setItems] = useState(initialItems);

  const [adding, setAdding] = useState(false);
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");

  const [editingId, setEditingId] = useState<number | null>(
    null
  );
  const [editDescription, setEditDescription] = useState("");
  const [editAssignee, setEditAssignee] = useState("");

  const [loading, setLoading] = useState(false);

  async function toggleComplete(item: ActionItem) {
    try {
      const updated = await updateActionItem(item.id, {
        completed: !item.completed,
      });

      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === updated.id
            ? updated
            : currentItem
        )
      );
    } catch {
      alert("Unable to update action item.");
    }
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();

    if (!description.trim()) {
      return;
    }

    try {
      setLoading(true);

      const item = await createActionItem(meetingId, {
        description: description.trim(),
        assignee: assignee.trim() || undefined,
      });

      setItems((current) => [...current, item]);

      setDescription("");
      setAssignee("");
      setAdding(false);
    } catch {
      alert("Unable to create action item.");
    } finally {
      setLoading(false);
    }
  }

  function startEditing(item: ActionItem) {
    setEditingId(item.id);
    setEditDescription(item.description);
    setEditAssignee(item.assignee ?? "");
  }

  async function saveEdit(itemId: number) {
    if (!editDescription.trim()) {
      return;
    }

    try {
      const updated = await updateActionItem(itemId, {
        description: editDescription.trim(),
        assignee: editAssignee.trim(),
      });

      setItems((current) =>
        current.map((item) =>
          item.id === itemId ? updated : item
        )
      );

      setEditingId(null);
    } catch {
      alert("Unable to update action item.");
    }
  }

  async function handleDelete(itemId: number) {
    const confirmed = window.confirm(
      "Delete this action item?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteActionItem(itemId);

      setItems((current) =>
        current.filter((item) => item.id !== itemId)
      );
    } catch {
      alert("Unable to delete action item.");
    }
  }

  return (
    <section>
      <div className="mb-4 flex items-center">
        <h2 className="font-semibold text-slate-900">
          Action items
        </h2>

        <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
          {items.length}
        </span>

        <button
          onClick={() => setAdding(true)}
          className="ml-auto flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      {adding && (
        <form
          onSubmit={handleCreate}
          className="mb-4 rounded-xl border border-violet-200 bg-violet-50/40 p-3"
        >
          <input
            autoFocus
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Action item..."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
          />

          <input
            value={assignee}
            onChange={(event) =>
              setAssignee(event.target.value)
            }
            placeholder="Assignee (optional)"
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
          />

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setDescription("");
                setAssignee("");
              }}
              className="rounded-md px-3 py-1.5 text-xs text-slate-500 hover:bg-white"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              type="submit"
              className="rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
            >
              Add item
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="group rounded-xl border border-slate-200 p-3"
          >
            {editingId === item.id ? (
              <>
                <input
                  value={editDescription}
                  onChange={(event) =>
                    setEditDescription(event.target.value)
                  }
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-violet-400"
                />

                <input
                  value={editAssignee}
                  onChange={(event) =>
                    setEditAssignee(event.target.value)
                  }
                  placeholder="Assignee"
                  className="mt-2 w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-violet-400"
                />

                <div className="mt-2 flex justify-end gap-1">
                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded p-1.5 text-slate-400 hover:bg-slate-100"
                  >
                    <X size={15} />
                  </button>

                  <button
                    onClick={() => saveEdit(item.id)}
                    className="rounded p-1.5 text-violet-600 hover:bg-violet-50"
                  >
                    <Check size={15} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleComplete(item)}
                  className="mt-0.5 shrink-0"
                >
                  {item.completed ? (
                    <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-green-500 text-white">
                      <Check size={12} />
                    </div>
                  ) : (
                    <Circle
                      size={18}
                      className="text-slate-300 hover:text-violet-500"
                    />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm leading-5 ${
                      item.completed
                        ? "text-slate-400 line-through"
                        : "text-slate-700"
                    }`}
                  >
                    {item.description}
                  </p>

                  {item.assignee && (
                    <p className="mt-1 text-xs text-slate-400">
                      {item.assignee}
                    </p>
                  )}
                </div>

                <div className="flex opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => startEditing(item)}
                    className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-400">
            No action items yet.
          </div>
        )}
      </div>
    </section>
  );
}