"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Search,
} from "lucide-react";

import { TranscriptSegment } from "@/lib/types";

interface Props {
  transcript: TranscriptSegment[];
  duration: number;
}

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = safeSeconds % 60;

  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function HighlightedText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query.trim()) {
    return <>{text}</>;
  }

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");

  return (
    <>
      {text.split(regex).map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={index}
            className="rounded bg-yellow-200 px-0.5 text-slate-800"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

export default function MeetingWorkspace({
  transcript,
  duration,
}: Props) {
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [query, setQuery] = useState("");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const playerDuration = Math.max(duration, 1);

  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentTime((previous) => {
        const next = previous + 0.25 * speed;

        if (next >= playerDuration) {
          setPlaying(false);
          return playerDuration;
        }

        return next;
      });
    }, 250);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [playing, speed, playerDuration]);

  const activeSegmentId = useMemo(() => {
    const active = transcript.find(
      (segment) =>
        currentTime >= segment.start_time &&
        currentTime < segment.end_time
    );

    return active?.id ?? null;
  }, [currentTime, transcript]);

  const filteredTranscript = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return transcript;
    }

    return transcript.filter(
      (segment) =>
        segment.text.toLowerCase().includes(normalized) ||
        segment.speaker.toLowerCase().includes(normalized)
    );
  }, [query, transcript]);

  function seek(time: number) {
    setCurrentTime(
      Math.max(0, Math.min(time, playerDuration))
    );
  }

  function skip(amount: number) {
    seek(currentTime + amount);
  }

  const progress =
    (currentTime / playerDuration) * 100;

  return (
    <>
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-8 py-4">
        <button
          onClick={() => skip(-10)}
          className="text-slate-500 transition hover:text-slate-900"
          title="Back 10 seconds"
        >
          <RotateCcw size={19} />
        </button>

        <button
          onClick={() => setPlaying((value) => !value)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700"
        >
          {playing ? (
            <Pause size={17} fill="currentColor" />
          ) : (
            <Play size={17} fill="currentColor" />
          )}
        </button>

        <button
          onClick={() => skip(10)}
          className="text-slate-500 transition hover:text-slate-900"
          title="Forward 10 seconds"
        >
          <RotateCw size={19} />
        </button>

        <span className="w-11 text-xs text-slate-500">
          {formatTime(currentTime)}
        </span>

        <input
          type="range"
          min={0}
          max={playerDuration}
          step={0.1}
          value={currentTime}
          onChange={(event) =>
            seek(Number(event.target.value))
          }
          className="flex-1 accent-violet-600"
          aria-label="Meeting playback position"
        />

        <span className="w-12 text-right text-xs text-slate-500">
          {formatTime(playerDuration)}
        </span>

        <select
          value={speed}
          onChange={(event) =>
            setSpeed(Number(event.target.value))
          }
          className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 outline-none"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={1.25}>1.25x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-white">
        <div className="border-b border-slate-200 p-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search transcript..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-violet-400"
            />
          </div>

          {query && (
            <p className="mt-2 text-xs text-slate-400">
              {filteredTranscript.length} matching segments
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredTranscript.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No transcript matches found.
            </div>
          ) : (
            filteredTranscript.map((segment) => {
              const active = segment.id === activeSegmentId;

              return (
                <button
                  key={segment.id}
                  onClick={() => seek(segment.start_time)}
                  className={`flex w-full gap-3 border-b border-slate-100 p-5 text-left transition ${
                    active
                      ? "bg-violet-50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      active
                        ? "bg-violet-600 text-white"
                        : "bg-violet-100 text-violet-700"
                    }`}
                  >
                    {initials(segment.speaker)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800">
                        {segment.speaker}
                      </span>

                      <span
                        className={`text-xs ${
                          active
                            ? "font-medium text-violet-600"
                            : "text-slate-400"
                        }`}
                      >
                        {formatTime(segment.start_time)}
                      </span>

                      {active && playing && (
                        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700">
                          Playing
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      <HighlightedText
                        text={segment.text}
                        query={query}
                      />
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}