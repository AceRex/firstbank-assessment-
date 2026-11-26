import type { InputHTMLAttributes, Ref } from "react";
import FieldError from "./FieldError";
import FieldLabel from "./FieldLabel";
import { controlBase, controlBorder } from "./fieldStyles";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  error?: string | null;
  ref?: Ref<HTMLInputElement>;
};

export default function TextField({ id, label, error, value, className = "", ...props }: TextFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={props.required}>
        {label}
      </FieldLabel>
      <input
        id={id}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${controlBase} ${controlBorder({ hasValue: Boolean(value), hasError: Boolean(error) })}`}
        {...props}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
