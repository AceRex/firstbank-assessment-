import { Check } from "lucide-react";
import { Link } from "react-router";
import { paths } from "../../routes/paths";
import type { AccountService } from "./services";

export default function ServiceCard({ service }: { service: AccountService }) {
  const { slug, title, requirements, ctaLabel, icon: Icon } = service;
  const headingId = `service-${slug}`;

  return (
    <article
      aria-labelledby={headingId}
      className="flex h-full min-h-[315px] flex-col rounded-[7px] bg-brand-sky py-6 pr-2 pl-6"
    >
      <span className="flex size-12 items-center justify-center rounded-md bg-brand-navy text-white">
        <Icon aria-hidden className="size-6" strokeWidth={1.75} />
      </span>

      <h2 id={headingId} className="mt-4 text-xl leading-none font-normal text-gray-900">
        {title}
      </h2>

      <p className="sr-only">Requirements:</p>
      <ul className="mt-5 space-y-2.5 pl-6 text-base leading-none font-normal">
        {requirements.map((requirement) => (
          <li key={requirement} className="flex items-center gap-2 text-gray-700">
            <Check aria-hidden className="size-5 shrink-0 text-brand-success" />
            <span>{requirement}</span>
          </li>
        ))}
      </ul>

      <Link
        to={paths.service(slug)}
        className="mt-auto self-start pt-8 text-xl leading-none font-bold text-brand-navy underline decoration-solid decoration-from-font underline-offset-auto [text-decoration-skip-ink:auto] hover:text-brand-link focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-link"
      >
        {ctaLabel}
      </Link>
    </article>
  );
}
