import { Bot } from "lucide-react";
import { site } from "../config/site";

/** Entry point to the virtual assistant, pinned to the footer's bottom-right corner. */
export default function AssistantChip({ className = "" }: { className?: string }) {
  return (
    <a
      href={site.assistantUrl}
      aria-label={`Chat with ${site.assistantName}, your virtual assistant`}
      className={`flex h-[46px] w-[190px] items-center gap-3 rounded-tl-[4px] rounded-r-[23px] rounded-bl-[18px] bg-white pl-3 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${className}`}
    >
      <span aria-hidden className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-brand-navy">
        <Bot className="size-5 text-brand-gold" strokeWidth={1.75} />
      </span>
      <span className="whitespace-nowrap">
        <span className="block text-[15px] leading-none font-semibold text-assistant-name">{site.assistantName}</span>
        <span className="mt-1 block text-[10.5px] leading-none text-assistant-tagline">Your virtual assistant</span>
      </span>
    </a>
  );
}
