import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
          <FileQuestion
            size={28}
            className="text-violet-600"
          />
        </div>

        <h1 className="mt-5 text-2xl font-semibold text-slate-900">
          Meeting not found
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          This meeting may have been deleted or doesn&apos;t exist.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
        >
          <ArrowLeft size={16} />
          Back to meetings
        </Link>
      </div>
    </div>
  );
}