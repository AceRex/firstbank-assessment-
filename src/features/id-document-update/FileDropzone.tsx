import { CloudUpload, Paperclip, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type DragEvent, type Ref } from "react";
import FieldError from "../../components/form/FieldError";
import { formatFileSize } from "./validation";

type FileDropzoneProps = {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string | null;
  /** Receives the main action button, so the form can focus it when the field is invalid. */
  focusRef?: Ref<HTMLButtonElement>;
};

const ACCEPT = ".pdf,.jpg,.jpeg,application/pdf,image/jpeg";

/** "Choose file or drag here" upload box. Once a file is chosen it shows its name (opens a preview) and size. */
export default function FileDropzone({ label, file, onChange, error, focusRef }: FileDropzoneProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  // Preview link for the chosen file; the object URL is released when the file changes or the box unmounts.
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const openPicker = () => inputRef.current?.click();

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const dropped = event.dataTransfer.files[0];
    if (dropped) onChange(dropped);
  }

  const errorId = `${id}-error`;
  const hasFile = Boolean(file && !error);

  return (
    <div>
      <p id={`${id}-label`} className="mb-2 text-[13px] leading-none font-light text-gray-600">
        {label}
      </p>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative flex min-h-[108px] flex-col items-center justify-center rounded-[2px] border border-dashed px-3 py-4 text-center text-sm text-gray-900 transition-colors ${
          error
            ? "border-error"
            : dragging
              ? "border-brand-link bg-brand-sky"
              : hasFile
                ? "border-gray-400 bg-brand-sky"
                : "border-gray-400"
        }`}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          aria-labelledby={`${id}-label`}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          onChange={(event) => {
            onChange(event.target.files?.[0] ?? null);
            event.target.value = ""; // allow choosing the same file again after removing it
          }}
        />

        {file && previewUrl ? (
          <>
            <Paperclip aria-hidden className="size-4 text-gray-700" strokeWidth={1.5} />
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 max-w-full truncate text-brand-link underline decoration-from-font"
            >
              {file.name}
            </a>
            <p className="mt-2">({formatFileSize(file.size)})</p>
            <button
              ref={focusRef}
              type="button"
              onClick={() => onChange(null)}
              aria-label={`Remove ${file.name}`}
              className="absolute top-1.5 right-1.5 cursor-pointer rounded p-1 text-gray-500 hover:bg-white hover:text-gray-900"
            >
              <X aria-hidden className="size-4" />
            </button>
          </>
        ) : (
          <>
            <CloudUpload aria-hidden className="size-6 text-gray-700" strokeWidth={1} />
            <p className="mt-1">
              <button
                ref={focusRef}
                type="button"
                onClick={openPicker}
                className="cursor-pointer text-brand-link underline decoration-from-font"
              >
                Choose file
              </button>{" "}
              or drag here
            </p>
            <p className="mt-2 text-[13px]">Supported files: PDF and JPG, 10.00MB maximum size</p>
          </>
        )}
      </div>

      <FieldError id={errorId} message={error} />
    </div>
  );
}
