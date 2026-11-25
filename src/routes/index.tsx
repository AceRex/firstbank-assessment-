import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import SiteLayout from "../layouts/SiteLayout";
import ErrorPage from "../pages/ErrorPage";
import NotFoundPage from "../pages/NotFoundPage";
import { lazyPage } from "./lazyPage";
import { paths } from "./paths";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <SiteLayout />,
        children: [
          {
            path: paths.home,
            element: lazyPage(() => import("../pages/ServicesPage"), "cards"),
          },
          {
            path: paths.identityDocumentUpdate,
            element: lazyPage(() => import("../pages/IdDocumentUpdatePage"), "form"),
          },
          {
            // Services listed on the landing page that have no online flow yet.
            path: paths.serviceRoute,
            element: lazyPage(() => import("../pages/ServiceUnavailablePage"), "detail"),
          },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
