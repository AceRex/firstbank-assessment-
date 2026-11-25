import avatarUrl from "../assets/fibani-avatar.png";
import { site } from "../config/site";

/** Entry point to the virtual assistant, shown at the bottom of the footer. */
export default function AssistantChip({ className = "" }: { className?: string }) {
  return (
    <a
      href={site.assistantUrl}
      aria-label={`Chat with ${site.assistantName}, your virtual assistant`}
      className={`flex h-[46px] w-[188px] items-center gap-2.5 rounded-l-xl rounded-r-full bg-white pr-4 pl-3 shadow-lg ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 ${className}`}
    >
      <img
        src={avatarUrl}
        alt=""
        width={38}
        height={38}
        className="size-[38px] shrink-0"
        loading="lazy"
        decoding="async"
      />
      <span className="leading-none whitespace-nowrap">
        <span className="block text-base font-semibold text-brand-navy">{site.assistantName}</span>
        <span className="block text-[11px] text-brand-navy/80">Your virtual assistant</span>
      </span>
    </a>
  );
}
