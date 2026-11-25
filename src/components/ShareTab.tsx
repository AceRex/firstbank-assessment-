import { useState } from "react";

/** Fixed "SHARE" tab on the left edge. Uses the native share sheet, falling back to copying the link. */
export default function ShareTab() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const data = { title: document.title, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(data.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // The user closing the share sheet is not an error.
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Share failed", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? "Link copied" : "Share this page"}
      className="fixed bottom-9 left-0 z-40 hidden h-[114px] w-[38px] items-center justify-center bg-white shadow-md sm:flex"
    >
      <span className="-rotate-90 text-[10px] font-semibold tracking-[0.12em] whitespace-nowrap text-brand-navy uppercase">
        {copied ? "Copied" : "Share"}
      </span>
      <span role="status" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </button>
  );
}
