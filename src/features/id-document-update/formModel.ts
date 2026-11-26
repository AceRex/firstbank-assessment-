/** Shape of everything the customer fills in on the Identity Document Update form. */
export type IdDocumentValues = {
  nin: string;
  documentType: string;
  documentNumber: string;
  front: File | null;
  back: File | null;
  utilityBill: File | null;
  occupation: string;
  natureOfBusiness: string;
  employerName: string;
  employerAddress: string;
  annualTurnover: string;
};

export type FieldName = keyof IdDocumentValues;
export type FormErrors = Partial<Record<FieldName, string>>;
export type TouchedFields = Partial<Record<FieldName, boolean>>;

export const initialFormValues: IdDocumentValues = {
  nin: "",
  documentType: "",
  documentNumber: "",
  front: null,
  back: null,
  utilityBill: null,
  occupation: "",
  natureOfBusiness: "",
  employerName: "",
  employerAddress: "",
  annualTurnover: "",
};

/** The identity-document part of the form, always shown after OTP verification. */
export const ID_FIELDS: readonly FieldName[] = ["nin", "documentType", "documentNumber", "front", "back"];

export const FILE_FIELDS: readonly FieldName[] = ["front", "back", "utilityBill"];
