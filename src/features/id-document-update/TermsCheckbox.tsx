import { Check } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { paths } from "../../routes/paths";

/**
 * "Accept Terms & Conditions". Ticking it opens the terms page — the box is only ticked by
 * pressing "I Agree" there, so the customer always sees the terms first. Unticking is direct.
 */
export default function TermsCheckbox({ checked, onUncheck }: { checked: boolean; onUncheck: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <span className="relative inline-flex size-5 shrink-0">
        <input
          id="accept-terms"
          type="checkbox"
          checked={checked}
          onChange={() => (checked ? onUncheck() : navigate(paths.identityDocumentUpdate.terms))}
          aria-describedby="accept-terms-hint"
          className="peer size-5 cursor-pointer appearance-none rounded-[3px] border-[1.5px] border-brand-link bg-white checked:bg-brand-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-link"
        />
        <Check
          aria-hidden
          strokeWidth={3}
          className="pointer-events-none absolute inset-0 m-auto size-3.5 text-white opacity-0 peer-checked:opacity-100"
        />
      </span>
      <label htmlFor="accept-terms" className="sr-only">
        I accept the Terms &amp; Conditions
      </label>
      <Link
        to={paths.identityDocumentUpdate.terms}
        className="text-lg leading-none text-brand-link underline decoration-from-font"
      >
        Accept Terms &amp; Conditions
      </Link>
      <span id="accept-terms-hint" className="sr-only">
        Opens the terms to read and accept.
      </span>
    </div>
  );
}
