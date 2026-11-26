import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

/** Back arrow + page title + gold underline used on the flow's form pages. */
export default function FlowHeader({ title, backTo }: { title: string; backTo: string }) {
  return (
    <div className="border-b-4 border-brand-gold pb-5">
      <div className="flex items-center gap-6">
        <Link
          to={backTo}
          aria-label="Go back"
          className="-m-1 rounded p-1 text-black hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-brand-link"
        >
          <ArrowLeft aria-hidden className="size-7" strokeWidth={2.25} />
        </Link>
        <h1 className="text-xl leading-none font-normal text-black">{title}</h1>
      </div>
    </div>
  );
}
