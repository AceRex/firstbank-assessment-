type Variant = "cards" | "list" | "detail" | "form";

function Bar({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

const bodies: Record<Variant, React.ReactNode> = {
  cards: (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(3,minmax(0,400px))] xl:justify-between xl:gap-y-14">
        {Array.from({ length: 6 }, (_, i) => (
          <Bar key={i} className="h-[315px]" />
        ))}
      </div>
    </>
  ),
  list: (
    <div className="space-y-3">
      {Array.from({ length: 6 }, (_, i) => (
        <Bar key={i} className="h-14" />
      ))}
    </div>
  ),
  detail: (
    <>
      <Bar className="h-32" />
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Bar key={i} className="h-12" />
        ))}
      </div>
    </>
  ),
  form: (
    <div className="max-w-md space-y-4">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="space-y-2">
          <Bar className="h-4 w-24" />
          <Bar className="h-10" />
        </div>
      ))}
      <Bar className="h-10 w-32" />
    </div>
  ),
};

export default function PageLoader({ variant = "list" }: { variant?: Variant }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="space-y-6">
      <span className="sr-only">Loading…</span>
      <Bar className="h-8 w-48" />
      {bodies[variant]}
    </div>
  );
}

export type { Variant as PageLoaderVariant };
