import { createBrowserRouter } from "react-router";
import RequireConsent from "../features/id-document-update/RequireConsent";
import IdUpdateFlowLayout from "../layouts/IdUpdateFlowLayout";
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
            // ID Document Update flow: consent → details → …
            path: paths.identityDocumentUpdate.root,
            element: <IdUpdateFlowLayout />,
            children: [
              {
                index: true,
                element: lazyPage(() => import("../pages/id-document-update/ConsentPage"), "detail"),
              },
              {
                path: "details",
                element: (
                  <RequireConsent>
                    {lazyPage(() => import("../pages/id-document-update/DetailsPage"), "form")}
                  </RequireConsent>
                ),
              },
              {
                path: "terms",
                element: (
                  <RequireConsent>
                    {lazyPage(() => import("../pages/id-document-update/TermsPage"), "detail")}
                  </RequireConsent>
                ),
              },
            ],
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
