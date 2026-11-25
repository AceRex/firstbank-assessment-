import { Link } from "react-router";
import logoUrl from "../assets/logo.png";
import { site } from "../config/site";
import { paths } from "../routes/paths";

/** Elephant mark only, cropped from the full logo (used in the footer). */
export function LogoMark({ className = "h-11 w-[38px]" }: { className?: string }) {
  return (
    <span aria-hidden className={`relative inline-block overflow-hidden ${className}`}>
      <img
        src={logoUrl}
        alt=""
        className="absolute top-0 right-0 h-full w-auto max-w-none"
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

export default function Logo() {
  return (
    <Link to={paths.home} className="inline-flex shrink-0">
      <img
        src={logoUrl}
        alt={`${site.bankName} home`}
        width={150}
        height={40}
        className="h-10 w-[150px] shrink-0"
        decoding="async"
      />
    </Link>
  );
}
