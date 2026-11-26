export type DocumentType = {
  value: string;
  label: string;
  /** Validates the document number (case-insensitive, spaces stripped). */
  pattern: RegExp;
  formatHint: string;
  maxLength: number;
  /** Passports only have a data page, so the back upload is optional. */
  requiresBack: boolean;
};

export const documentTypes: readonly DocumentType[] = [
  {
    value: "international-passport",
    label: "International Passport",
    pattern: /^[A-Z]\d{8}$/,
    formatHint: "1 letter followed by 8 digits, e.g. A12345678",
    maxLength: 9,
    requiresBack: false,
  },
  {
    value: "drivers-licence",
    label: "Driver's Licence",
    pattern: /^[A-Z0-9]{12}$/,
    formatHint: "12 letters and digits, e.g. ABC12345AA11",
    maxLength: 12,
    requiresBack: true,
  },
  {
    value: "national-id-card",
    label: "National ID Card",
    pattern: /^\d{11}$/,
    formatHint: "11 digits",
    maxLength: 11,
    requiresBack: true,
  },
  {
    value: "voters-card",
    label: "Permanent Voter's Card",
    pattern: /^[A-Z0-9]{19}$/,
    formatHint: "19 letters and digits",
    maxLength: 19,
    requiresBack: true,
  },
];

export const findDocumentType = (value: string) =>
  documentTypes.find((type) => type.value === value);
