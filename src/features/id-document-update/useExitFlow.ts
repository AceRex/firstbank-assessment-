import { useCallback } from "react";
import { useNavigate } from "react-router";
import { paths } from "../../routes/paths";
import { clearFlowStorage } from "./flowState";

/**
 * Leaves the ID Document Update flow (reject consent, cancel request, done).
 *
 * The flow's in-memory state lives in the provider on the flow's parent route, so navigating
 * away unmounts it and the state goes with it; we only need to clear what was saved for the tab.
 * (Resetting the state *before* navigating would make the consent guard redirect to the
 * consent page mid-navigation.)
 */
export function useExitFlow() {
  const navigate = useNavigate();
  return useCallback(() => {
    clearFlowStorage();
    navigate(paths.home);
  }, [navigate]);
}
