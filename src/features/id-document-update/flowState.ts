import { createContext, useContext, type Dispatch } from "react";
import type { VerificationResult } from "./api";
import { initialFormValues, type FieldName, type IdDocumentValues, type TouchedFields } from "./formModel";

/**
 * State shared by every page of the ID Document Update flow (consent → form → terms → form).
 * It lives in a provider on the flow's parent route, so it survives moving between those pages —
 * including the uploaded files, which is why the form's values are kept here and not in the page.
 */
export type IdUpdateFlowState = {
  consent: { accepted: boolean; acceptedAt: string | null };
  /** Set once the phone OTP is confirmed. Never persisted: a refresh asks for a new OTP. */
  verification: VerificationResult | null;
  form: { values: IdDocumentValues; touched: TouchedFields };
  /** Answer to the "Additional document required" prompt. */
  utilityBillChoice: "upload" | "skip" | null;
  termsAccepted: boolean;
  /** "Complete now" was pressed on the outstanding-information prompt. */
  outstandingRevealed: boolean;
};

export type IdUpdateFlowAction =
  | { type: "consent/accepted"; at: string }
  | { type: "account/verified"; verification: VerificationResult }
  | { type: "form/changed"; name: FieldName; value: string | File | null }
  | { type: "form/touched"; names: readonly FieldName[] }
  | { type: "utilityBill/chosen"; choice: "upload" | "skip" }
  | { type: "terms/accepted" }
  | { type: "terms/declined" }
  | { type: "outstanding/revealed" };

export const initialFlowState: IdUpdateFlowState = {
  consent: { accepted: false, acceptedAt: null },
  verification: null,
  form: { values: initialFormValues, touched: {} },
  utilityBillChoice: null,
  termsAccepted: false,
  outstandingRevealed: false,
};

/** Pure: anything time- or IO-dependent arrives in the action payload. */
export function flowReducer(state: IdUpdateFlowState, action: IdUpdateFlowAction): IdUpdateFlowState {
  switch (action.type) {
    case "consent/accepted":
      return { ...state, consent: { accepted: true, acceptedAt: action.at } };
    case "account/verified":
      return { ...state, verification: action.verification };
    case "form/changed":
      return {
        ...state,
        form: { ...state.form, values: { ...state.form.values, [action.name]: action.value } },
      };
    case "form/touched": {
      const touched = { ...state.form.touched };
      for (const name of action.names) touched[name] = true;
      return { ...state, form: { ...state.form, touched } };
    }
    case "utilityBill/chosen":
      return { ...state, utilityBillChoice: action.choice };
    case "terms/accepted":
      return { ...state, termsAccepted: true };
    case "terms/declined":
      return { ...state, termsAccepted: false };
    case "outstanding/revealed":
      return { ...state, outstandingRevealed: true };
  }
}

/* Only consent is persisted (sessionStorage, so it dies with the tab) — enough to survive a
   refresh without the customer re-reading the form. Verification, form data and files stay in
   memory. Storage may be unavailable (private mode, blocked site data), so failures fall back
   to in-memory state. */
const STORAGE_KEY = "id-document-update-flow";

type PersistedState = Pick<IdUpdateFlowState, "consent">;

export function loadFlowState(): IdUpdateFlowState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return initialFlowState;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    const consent =
      parsed.consent?.accepted === true && typeof parsed.consent.acceptedAt === "string"
        ? { accepted: true, acceptedAt: parsed.consent.acceptedAt }
        : initialFlowState.consent;
    return { ...initialFlowState, consent };
  } catch {
    return initialFlowState;
  }
}

export function saveFlowState(state: IdUpdateFlowState) {
  try {
    const persisted: PersistedState = { consent: state.consent };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  } catch {
    // Ignore: the flow still works for this page session.
  }
}

/** Forgets the saved progress (used when the customer leaves the flow). */
export function clearFlowStorage() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}

type FlowContextValue = {
  state: IdUpdateFlowState;
  dispatch: Dispatch<IdUpdateFlowAction>;
};

export const IdUpdateFlowContext = createContext<FlowContextValue | null>(null);

export function useIdUpdateFlow() {
  const context = useContext(IdUpdateFlowContext);
  if (!context) {
    throw new Error("useIdUpdateFlow must be used inside <IdUpdateFlowProvider>");
  }
  return context;
}
