"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <AlertCircle
            size={25}
            className="text-red-500"
          />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-slate-900">
          Something went wrong
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          We couldn&apos;t load this page. Check that the
          backend server is running and try again.
        </p>

        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    </div>
  );
}