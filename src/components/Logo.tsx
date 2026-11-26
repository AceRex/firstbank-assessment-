import { Link } from "react-router";
import { site } from "../config/site";
import { paths } from "../routes/paths";

/** Logic Bank mark: gold tile with a navy "L". Vector, so it stays sharp and costs no request. */
export function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={`shrink-0 ${className}`}>
      <rect width="40" height="40" rx="8" fill="#fbb931" />
      <path d="M13 9v21h15" fill="none" stroke="#002855" strokeWidth="5" strokeLinecap="square" />
      <circle cx="28" cy="13.5" r="3.5" fill="#002855" />
    </svg>
  );
}

/** Header logo, 150×40 as specified for the design's logo slot. */
export default function Logo() {
  return (
    <Link
      to={paths.home}
      aria-label={`${site.bankName} home`}
      className="inline-flex h-10 w-[150px] shrink-0 items-center gap-2"
    >
      <LogoMark className="size-9" />
      <span aria-hidden className="text-[21px] leading-none tracking-tight whitespace-nowrap text-brand-navy">
        <span className="font-bold">Logic</span>
        <span className="font-normal">Bank</span>
      </span>
    </Link>
  );
}
