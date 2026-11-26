import type { ServiceSlug } from "../features/services/services";

const ID_UPDATE = "/services/identity-document-update";

export const paths = {
  home: "/",
  service: (slug: ServiceSlug) => `/services/${slug}`,
  serviceRoute: "/services/:serviceSlug",
  identityDocumentUpdate: {
    root: ID_UPDATE,
    consent: ID_UPDATE,
    details: `${ID_UPDATE}/details`,
    terms: `${ID_UPDATE}/terms`,
  },
} as const;
