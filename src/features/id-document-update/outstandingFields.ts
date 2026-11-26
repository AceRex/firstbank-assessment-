/**
 * "Outstanding Information" the bank may still need on an account (KYC gaps).
 * The API says which of these an account is missing; this file says how to render them.
 */
export type OutstandingFieldName =
  | "occupation"
  | "natureOfBusiness"
  | "employerName"
  | "employerAddress"
  | "annualTurnover";

type Option = { value: string; label: string };

export type OutstandingFieldConfig =
  | { kind: "select"; label: string; placeholder: string; options: readonly Option[] }
  | { kind: "text"; label: string; placeholder: string; maxLength: number };

const toOptions = (labels: string[]): Option[] =>
  labels.map((label) => ({ value: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"), label }));

export const outstandingFieldConfig: Record<OutstandingFieldName, OutstandingFieldConfig> = {
  occupation: {
    kind: "select",
    label: "Occupation",
    placeholder: "Select your occupation",
    options: toOptions([
      "Banker",
      "Civil Servant",
      "Doctor",
      "Engineer",
      "Lawyer",
      "Teacher",
      "Trader",
      "Artisan",
      "Student",
      "Retired",
      "Other",
    ]),
  },
  natureOfBusiness: {
    kind: "select",
    label: "Nature of Business",
    placeholder: "Select your nature of business",
    options: toOptions(["Employee", "Self-employed", "Business Owner", "Unemployed", "Student", "Retired"]),
  },
  employerName: {
    kind: "text",
    label: "Employer Name",
    placeholder: "Enter your employer's name",
    maxLength: 100,
  },
  employerAddress: {
    kind: "text",
    label: "Employer Address",
    placeholder: "Enter your employer's address",
    maxLength: 200,
  },
  annualTurnover: {
    kind: "select",
    label: "Annual Turn-Over",
    placeholder: "Select your annual turn-over",
    options: [
      { value: "below-1m", label: "Below ₦1,000,000" },
      { value: "1m-5m", label: "₦1,000,000 – ₦5,000,000" },
      { value: "5m-10m", label: "₦5,000,001 – ₦10,000,000" },
      { value: "10m-50m", label: "₦10,000,001 – ₦50,000,000" },
      { value: "above-50m", label: "Above ₦50,000,000" },
    ],
  },
};
