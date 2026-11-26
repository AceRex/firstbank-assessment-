import { useCallback, useMemo } from "react";
import type { AccountRequirements, IdUpdateSubmission } from "./api";
import { findDocumentType } from "./documentTypes";
import { useIdUpdateFlow, type IdUpdateFlowState } from "./flowState";
import { FILE_FIELDS, ID_FIELDS, type FieldName, type FormErrors, type IdDocumentValues } from "./formModel";
import { outstandingFieldConfig, type OutstandingFieldName } from "./outstandingFields";
import {
  validateDocumentNumber,
  validateDocumentType,
  validateFile,
  validateNin,
  validateRequiredSelect,
  validateText,
} from "./validation";

const NO_REQUIREMENTS: AccountRequirements = { utilityBillRequired: false, outstandingFields: [] };

/** Validates one field given the whole form and the account's requirements. */
function validateField(name: FieldName, values: IdDocumentValues, requirements: AccountRequirements): string | null {
  switch (name) {
    case "nin":
      return validateNin(values.nin);
    case "documentType":
      return validateDocumentType(values.documentType);
    case "documentNumber":
      return validateDocumentNumber(values.documentNumber, values.documentType);
    case "front":
      return validateFile(values.front, { required: true, what: "the front of your identity document" });
    case "back":
      return validateFile(values.back, {
        required: findDocumentType(values.documentType)?.requiresBack ?? true,
        what: "the back of your identity document",
      });
    case "utilityBill":
      return validateFile(values.utilityBill, { required: true, what: "your utility bill" });
    default: {
      const config = outstandingFieldConfig[name];
      const required = requirements.outstandingFields.some((f) => f.name === name && f.required);
      return config.kind === "select"
        ? validateRequiredSelect(values[name], { required, label: config.label })
        : validateText(values[name], { required, label: config.label, maxLength: config.maxLength });
    }
  }
}

/**
 * Derives every "what should the page show now" rule from the flow state, so the page has no
 * effects or duplicated flags: prompts open and sections appear purely from the data.
 */
function deriveFormRules(state: IdUpdateFlowState) {
  const { form, utilityBillChoice, termsAccepted, outstandingRevealed } = state;
  const requirements = state.verification?.requirements ?? NO_REQUIREMENTS;
  const isValid = (name: FieldName) => !validateField(name, form.values, requirements);

  const idDocumentsComplete = ID_FIELDS.every(isValid);
  const hasOutstanding = requirements.outstandingFields.length > 0;
  const utilityBillVisible = requirements.utilityBillRequired && utilityBillChoice === "upload";
  const utilityBillSettled =
    !requirements.utilityBillRequired ||
    utilityBillChoice === "skip" ||
    (utilityBillChoice === "upload" && isValid("utilityBill"));

  const termsVisible = idDocumentsComplete && utilityBillSettled;
  const outstandingVisible = hasOutstanding && outstandingRevealed;

  const activeFields: FieldName[] = [
    ...ID_FIELDS,
    ...(utilityBillVisible ? (["utilityBill"] as const) : []),
    ...(outstandingVisible ? requirements.outstandingFields.map((f) => f.name) : []),
  ];

  return {
    requirements,
    activeFields,
    utilityBillVisible,
    termsVisible,
    outstandingVisible,
    /** "Additional document required" — once the ID documents are in, until answered. */
    utilityPromptOpen: requirements.utilityBillRequired && idDocumentsComplete && utilityBillChoice === null,
    /** "Please proceed to update information" — right after the terms are accepted. */
    outstandingPromptOpen: termsVisible && termsAccepted && hasOutstanding && !outstandingRevealed,
    submitVisible: termsVisible && termsAccepted && (!hasOutstanding || outstandingRevealed),
  };
}

/**
 * The Identity Document form's state, kept in the flow context so uploads survive a trip to the
 * Terms & Conditions page. Errors appear once a field is left (blur) or the form is submitted.
 */
export function useIdDocumentForm() {
  const { state, dispatch } = useIdUpdateFlow();
  const { values, touched } = state.form;
  const rules = useMemo(() => deriveFormRules(state), [state]);

  const setValue = useCallback(
    (name: FieldName, value: string | File | null) => {
      dispatch({ type: "form/changed", name, value });
      // Files are checked the moment they're chosen so a wrong type/size shows immediately.
      if (FILE_FIELDS.includes(name)) dispatch({ type: "form/touched", names: [name] });
    },
    [dispatch],
  );

  const touch = useCallback((name: FieldName) => dispatch({ type: "form/touched", names: [name] }), [dispatch]);

  const errors = useMemo(() => {
    const result: FormErrors = {};
    for (const name of rules.activeFields) {
      if (!touched[name]) continue;
      const error = validateField(name, values, rules.requirements);
      if (error) result[name] = error;
    }
    return result;
  }, [rules, touched, values]);

  /** Marks every active field touched; returns the first invalid one, or null when valid. */
  const validateAll = useCallback((): FieldName | null => {
    dispatch({ type: "form/touched", names: rules.activeFields });
    return rules.activeFields.find((name) => validateField(name, values, rules.requirements)) ?? null;
  }, [dispatch, rules, values]);

  /** Builds the API payload. Call only after validateAll() returned null. */
  const toSubmission = useCallback((): IdUpdateSubmission => {
    const { verification, consent } = state;
    if (!verification || !consent.acceptedAt || !values.front) {
      throw new Error("toSubmission called before the form was complete");
    }
    const outstanding: Partial<Record<OutstandingFieldName, string>> = {};
    if (rules.outstandingVisible) {
      for (const { name } of rules.requirements.outstandingFields) {
        const value = values[name].trim();
        if (value) outstanding[name] = value;
      }
    }
    return {
      accountNumber: verification.accountNumber,
      consentAcceptedAt: consent.acceptedAt,
      termsAccepted: true,
      nin: values.nin,
      documentType: values.documentType,
      documentNumber: values.documentNumber,
      front: values.front,
      back: values.back,
      utilityBill: rules.utilityBillVisible ? values.utilityBill : null,
      outstanding,
    };
  }, [rules, state, values]);

  return {
    values,
    errors,
    rules,
    termsAccepted: state.termsAccepted,
    setValue,
    touch,
    validateAll,
    toSubmission,
    chooseUtilityBill: (choice: "upload" | "skip") => dispatch({ type: "utilityBill/chosen", choice }),
    declineTerms: () => dispatch({ type: "terms/declined" }),
    revealOutstanding: () => dispatch({ type: "outstanding/revealed" }),
  };
}
