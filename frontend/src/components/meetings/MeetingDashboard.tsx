"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";

import { Meeting } from "@/lib/types";
import MeetingCard from "./MeetingCard";

interface Props {
  meetings: Meeting[];
}

type SortOption = "recent" | "oldest" | "title";

export default function MeetingDashboard({ meetings }: Props) {
  const [search, setSearch] = useState("");
  const [participant, setParticipant] = useState("");
  const [sort, setSort] = useState<SortOption>("recent");

  const participants = useMemo(() => {
    const names = meetings.flatMap((meeting) =>
      meeting.participants.map((person) => person.name)
    );

    return [...new Set(names)].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [meetings]);

  const filteredMeetings = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = meetings.filter((meeting) => {
      const matchesSearch =
        query === "" ||
        meeting.title.toLowerCase().includes(query) ||
        (meeting.summary ?? "")
          .toLowerCase()
          .includes(query) ||
        meeting.participants.some((person) =>
          person.name.toLowerCase().includes(query)
        );

      const matchesParticipant =
        participant === "" ||
        meeting.participants.some(
          (person) => person.name === participant
        );

      return matchesSearch && matchesParticipant;
    });

    return [...result].sort((a, b) => {
      if (sort === "oldest") {
        return (
          new Date(a.meeting_date).getTime() -
          new Date(b.meeting_date).getTime()
        );
      }

      if (sort === "title") {
        return a.title.localeCompare(b.title);
      }

      return (
        new Date(b.meeting_date).getTime() -
        new Date(a.meeting_date).getTime()
      );
    });
  }, [meetings, search, participant, sort]);

  const filtersActive =
    search.trim() !== "" || participant !== "";

  function clearFilters() {
    setSearch("");
    setParticipant("");
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search meetings, summaries or participants..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Users
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={participant}
              onChange={(event) =>
                setParticipant(event.target.value)
              }
              className="rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-600 outline-none transition focus:border-violet-400"
            >
              <option value="">All participants</option>

              {participants.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <SlidersHorizontal
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as SortOption)
              }
              className="rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-600 outline-none transition focus:border-violet-400"
            >
              <option value="recent">Most recent</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Meeting title</option>
            </select>
          </div>

          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            >
              <X size={15} />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">
            My meetings
          </h2>

          <span className="text-sm text-slate-500">
            {filteredMeetings.length}{" "}
            {filteredMeetings.length === 1
              ? "meeting"
              : "meetings"}
          </span>
        </div>

        {filteredMeetings.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {filteredMeetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Search
                size={20}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-4 font-medium text-slate-800">
              No meetings found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Try changing your search term or participant
              filter.
            </p>

            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-sm font-medium text-violet-600 hover:text-violet-700"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}