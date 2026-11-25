import { Link, useParams } from "react-router";
import { findService } from "../features/services/services";
import { paths } from "../routes/paths";
import NotFoundPage from "./NotFoundPage";

export default function ServiceUnavailablePage() {
  const { serviceSlug } = useParams();
  const service = findService(serviceSlug);

  if (!service) return <NotFoundPage />;

  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <h1 className="text-2xl font-semibold text-brand-navy">{service.title}</h1>
      <p className="mt-3 text-gray-600">
        This service isn't available online yet. Please visit any of our branches or contact
        support for help.
      </p>
      <Link
        to={paths.home}
        className="mt-6 inline-block font-semibold text-brand-navy underline underline-offset-4"
      >
        Back to services
      </Link>
    </div>
  );
}
