export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-8 w-40 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-72 rounded bg-slate-200" />

        <div className="mt-8 flex gap-3">
          <div className="h-10 flex-1 rounded-lg bg-slate-200" />
          <div className="h-10 w-40 rounded-lg bg-slate-200" />
          <div className="h-10 w-36 rounded-lg bg-slate-200" />
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-48 rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="h-5 w-2/3 rounded bg-slate-200" />
              <div className="mt-3 h-3 w-1/3 rounded bg-slate-200" />
              <div className="mt-7 h-3 w-full rounded bg-slate-100" />
              <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}