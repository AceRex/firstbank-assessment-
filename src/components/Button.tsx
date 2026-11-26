import type { ButtonHTMLAttributes } from "react";

type Variant = "solid" | "outline";
type Size = "sm" | "md";

const base =
  "inline-flex h-10 cursor-pointer items-center justify-center gap-[5.61px] px-[16.82px] py-[14.01px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-link disabled:cursor-not-allowed disabled:opacity-60";

const sizes: Record<Size, string> = {
  /** Consent form buttons. */
  sm: "rounded-[2.8px] text-[11px] leading-3 font-medium",
  /** Dialog / form actions. */
  md: "rounded-[4px] text-base leading-none font-semibold",
};

const variants: Record<Variant, Record<Size, string>> = {
  solid: {
    sm: "bg-brand-ink text-white hover:bg-brand-ink/90",
    md: "bg-brand-navy text-white hover:bg-brand-navy/90",
  },
  outline: {
    sm: "border-[0.7px] border-brand-ink bg-white text-brand-ink hover:bg-brand-ink/5",
    md: "border-[1.5px] border-brand-navy bg-white text-brand-navy hover:bg-brand-navy/5",
  },
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export default function Button({
  variant = "solid",
  size = "sm",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${base} ${sizes[size]} ${variants[variant][size]} ${className}`}
      {...props}
    />
  );
}
