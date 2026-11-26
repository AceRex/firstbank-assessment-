import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { OTP_LENGTH } from "./validation";

type OtpInputProps = {
  digits: string[];
  onChange: (digits: string[]) => void;
  disabled?: boolean;
  invalid?: boolean;
  labelledBy: string;
  describedBy?: string;
  /** Focuses the first box whenever this value changes (e.g. each time an OTP is sent). */
  focusSignal?: unknown;
};

/**
 * Six single-digit boxes that behave like one field:
 * auto-advance, backspace to previous, arrow keys, and paste / SMS autofill of the whole code.
 */
export default function OtpInput({
  digits,
  onChange,
  disabled,
  invalid,
  labelledBy,
  describedBy,
  focusSignal,
}: OtpInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (focusSignal != null) inputs.current[0]?.focus();
  }, [focusSignal]);

  const focus = (index: number) => {
    const target = inputs.current[Math.max(0, Math.min(OTP_LENGTH - 1, index))];
    target?.focus();
    target?.select();
  };

  /** Writes `value` starting at `index`, spilling into later boxes (paste / autofill). */
  function fill(index: number, value: string) {
    const chars = value.replace(/\D/g, "").slice(0, OTP_LENGTH - index).split("");
    if (chars.length === 0) return;
    const next = [...digits];
    chars.forEach((char, offset) => (next[index + offset] = char));
    onChange(next);
    focus(index + chars.length);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = [...digits];
      if (next[index]) {
        next[index] = "";
      } else if (index > 0) {
        next[index - 1] = "";
        focus(index - 1);
      }
      onChange(next);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focus(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focus(index + 1);
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    fill(index, event.clipboardData.getData("text"));
  }

  return (
    <div role="group" aria-labelledby={labelledBy} aria-describedby={describedBy} className="flex gap-2 sm:gap-4">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputs.current[index] = element;
          }}
          value={digit}
          onChange={(event) => fill(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          onFocus={(event) => event.target.select()}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={OTP_LENGTH} // allows SMS autofill to drop the full code into one box
          aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
          aria-invalid={invalid}
          className={`size-12 rounded-[4px] border-[0.5px] bg-white text-center text-2xl text-gray-900 outline-none focus:border-brand-ink focus:ring-1 focus:ring-brand-ink disabled:cursor-not-allowed disabled:bg-gray-50 sm:size-[60px] ${
            digit ? "border-brand-ink" : "border-gray-400"
          }`}
        />
      ))}
    </div>
  );
}
