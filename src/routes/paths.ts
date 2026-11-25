import type { ServiceSlug } from "../features/services/services";

export const paths = {
  home: "/",
  service: (slug: ServiceSlug) => `/services/${slug}`,
  serviceRoute: "/services/:serviceSlug",
  identityDocumentUpdate: "/services/identity-document-update",
} as const;
