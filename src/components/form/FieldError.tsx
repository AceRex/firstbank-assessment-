export default function FieldError({ id, message }: { id: string; message?: string | null }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-start gap-2 text-sm text-error">
      <ErrorDot />
      <span>{message}</span>
    </p>
  );
}

export function ErrorDot({ className = "size-5" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-error text-xs font-bold text-white ${className}`}
    >
      i
    </span>
  );
}
