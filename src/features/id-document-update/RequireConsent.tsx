import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { paths } from "../../routes/paths";
import { useIdUpdateFlow } from "./flowState";

/** Sends the customer back to the consent form if they reach a later step without agreeing. */
export default function RequireConsent({ children }: { children: ReactNode }) {
  const { state } = useIdUpdateFlow();
  if (!state.consent.accepted) {
    return <Navigate to={paths.identityDocumentUpdate.consent} replace />;
  }
  return children;
}
