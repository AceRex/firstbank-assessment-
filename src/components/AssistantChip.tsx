import avatarUrl from "../assets/fibani-avatar.png";
import { site } from "../config/site";

/** Entry point to the virtual assistant, pinned to the footer's bottom-right corner. */
export default function AssistantChip({ className = "" }: { className?: string }) {
  return (
    <a
      href={site.assistantUrl}
      aria-label={`Chat with ${site.assistantName}, your virtual assistant`}
      className={`flex h-[46px] w-[190px] items-center gap-3 rounded-tl-[4px] rounded-r-[23px] rounded-bl-[18px] bg-white pl-4 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${className}`}
    >
      <img
        src={avatarUrl}
        alt=""
        width={38}
        height={38}
        className="size-[38px] shrink-0 self-end mb-[5px]"
        loading="lazy"
        decoding="async"
      />
      <span className="whitespace-nowrap">
        <span className="block text-[15px] leading-none font-semibold text-assistant-name">
          {site.assistantName}
        </span>
        <span className="mt-1 block text-[10.5px] leading-none text-assistant-tagline">
          Your virtual assistant
        </span>
      </span>
    </a>
  );
}
