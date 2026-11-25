import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { paths } from "../routes/paths";

export default function ErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Unknown error";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-gray-600">{message}</p>
      <Link to={paths.home} className="text-blue-600 hover:underline">
        Go home
      </Link>
    </div>
  );
}
