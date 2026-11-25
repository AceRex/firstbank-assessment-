import { lazy, Suspense, type ComponentType } from "react";
import PageLoader, { type PageLoaderVariant } from "../components/PageLoader";

/**
 * Code-splits a page and shows a skeleton shaped like it while the chunk loads.
 */
export function lazyPage(
  load: () => Promise<{ default: ComponentType }>,
  variant: PageLoaderVariant = "list",
) {
  const Page = lazy(load);
  return (
    <Suspense fallback={<PageLoader variant={variant} />}>
      <Page />
    </Suspense>
  );
}
