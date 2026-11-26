import type { Ref, SelectHTMLAttributes } from "react";
import FieldError from "./FieldError";
import FieldLabel from "./FieldLabel";
import { controlBase, controlBorder } from "./fieldStyles";

type Option = { value: string; label: string };

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  id: string;
  label: string;
  placeholder: string;
  options: readonly Option[];
  error?: string | null;
  value: string;
  ref?: Ref<HTMLSelectElement>;
};

export default function SelectField({
  id,
  label,
  placeholder,
  options,
  error,
  value,
  className = "",
  ...props
}: SelectFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={props.required}>
        {label}
      </FieldLabel>
      <div className="relative">
        <select
          id={id}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${controlBase} cursor-pointer appearance-none pr-12 ${value ? "" : "text-gray-700"} ${controlBorder({ hasValue: Boolean(value), hasError: Boolean(error) })}`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Solid triangle from the design */}
        <svg
          aria-hidden
          viewBox="0 0 16 12"
          className="pointer-events-none absolute top-1/2 right-5 size-4 -translate-y-1/2 fill-black"
        >
          <path d="M0 0h16L8 12z" />
        </svg>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
