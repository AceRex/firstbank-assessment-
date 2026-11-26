import type { ReactNode } from "react";
import { labelClass } from "./fieldStyles";

/** Field label with the design's red asterisk for compulsory fields. */
export default function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children}
      {required && (
        <>
          <span aria-hidden className="ml-1 text-error">
            *
          </span>
          <span className="sr-only"> (required)</span>
        </>
      )}
    </label>
  );
}
