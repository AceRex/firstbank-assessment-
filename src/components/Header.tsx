import { Headset, Search } from "lucide-react";
import { site } from "../config/site";
import Container from "./Container";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="bg-white">
      <Container className="flex items-center justify-between gap-4 py-6 lg:py-12">
        <Logo />

        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href={site.openAccountUrl}
            className="hidden text-lg leading-none font-normal text-brand-link underline decoration-solid decoration-from-font underline-offset-auto [text-decoration-skip-ink:auto] hover:text-brand-navy md:inline"
          >
            Open a {site.bankName} account
          </a>
          <button
            type="button"
            aria-label="Search"
            className="rounded p-1 text-brand-link hover:text-brand-navy"
          >
            <Search aria-hidden className="size-6" />
          </button>
          <a
            href={site.helpUrl}
            className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-4 py-2 text-lg text-brand-navy transition-colors hover:bg-amber-400 sm:px-6"
          >
            <Headset aria-hidden className="size-5" />
            Help
          </a>
        </div>
      </Container>
    </header>
  );
}
