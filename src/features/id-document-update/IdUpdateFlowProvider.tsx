import { useEffect, useMemo, useReducer, type ReactNode } from "react";
import { flowReducer, IdUpdateFlowContext, loadFlowState, saveFlowState } from "./flowState";

export default function IdUpdateFlowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(flowReducer, undefined, loadFlowState);

  useEffect(() => {
    saveFlowState(state);
  }, [state]);

  // Stable object so consumers only re-render when the state actually changes.
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <IdUpdateFlowContext.Provider value={value}>{children}</IdUpdateFlowContext.Provider>;
}
