import { Link } from "react-router";
import { paths } from "../routes/paths";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <h1 className="text-2xl font-semibold text-brand-navy">Page not found</h1>
      <p className="mt-3 text-gray-600">The page you're looking for doesn't exist.</p>
      <Link
        to={paths.home}
        className="mt-6 inline-block font-semibold text-brand-navy underline underline-offset-4"
      >
        Back to services
      </Link>
    </div>
  );
}
