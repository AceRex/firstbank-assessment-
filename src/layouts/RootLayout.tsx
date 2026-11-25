import { Outlet, useNavigation } from "react-router";

export default function RootLayout() {
  // Non-idle while a route loader/action runs (once pages start using loaders).
  const isNavigating = useNavigation().state !== "idle";

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      {isNavigating && (
        <div
          role="progressbar"
          aria-label="Loading page"
          className="fixed inset-x-0 top-0 z-50 h-1 animate-pulse bg-brand-gold"
        />
      )}
      <Outlet />
    </>
  );
}
