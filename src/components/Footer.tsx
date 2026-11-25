import { footerColumns, languages, site } from "../config/site";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "./icons/SocialIcons";
import AssistantChip from "./AssistantChip";
import { LogoMark } from "./Logo";

const socials = [
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "X (Twitter)", href: "#", Icon: XIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "YouTube", href: "#", Icon: YoutubeIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedinIcon },
];

export default function Footer() {
  return (
    <footer className="relative bg-brand-navy-deep text-white">
      <div className="mx-auto w-full max-w-[61.75rem] px-4 pt-12 pb-10 sm:px-6">
        {/* Logo, language and socials */}
        <div className="flex flex-col gap-6 border-b border-brand-gold-line pb-9 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <LogoMark className="h-[45px] w-[39px]" />
            <label htmlFor="footer-language" className="sr-only">
              Language
            </label>
            <select
              id="footer-language"
              defaultValue="en"
              className="h-[31px] w-[142px] appearance-none rounded-none bg-white px-3.5 text-[13px] text-brand-navy"
            >
              {languages.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <ul className="flex gap-3.5">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full bg-brand-navy-darker transition-colors hover:bg-brand-navy"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Link columns */}
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-y-10 border-b border-brand-gold-line pt-10 pb-11 md:grid-cols-4"
        >
          {footerColumns.map(({ heading, links }) => (
            <div key={heading} className="pr-4">
              <h2 className="text-[10px] leading-none font-semibold tracking-[0.12em] uppercase">
                {heading}
              </h2>
              <ul className="mt-6 space-y-4">
                {links.map(({ label, href }) => (
                  <li key={label} className="leading-4">
                    <a
                      href={href}
                      className="text-xs text-white/80 hover:text-white hover:underline"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Copyright */}
        <div className="flex flex-col gap-4 pt-11 text-[10px] sm:flex-row sm:items-start sm:justify-between">
          <p className="pt-1.5 text-white/85">{site.copyright}</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0 })}
            className="self-start hover:underline sm:self-auto"
          >
            Back to Top
          </button>
        </div>

        {/* In flow on smaller screens; pinned to the footer's bottom-right corner on wide ones. */}
        <AssistantChip className="mt-8 ml-auto min-[1440px]:absolute min-[1440px]:right-8 min-[1440px]:bottom-5 min-[1440px]:mt-0" />
      </div>
    </footer>
  );
}
