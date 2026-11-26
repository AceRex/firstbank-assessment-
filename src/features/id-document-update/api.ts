import type { OutstandingFieldName } from "./outstandingFields";

/**
 * Mock backend for the ID Document Update flow. Every function returns a Promise with
 * simulated latency so the UI handles loading and failure exactly as it would against a
 * real API — swap the bodies for `fetch` calls without touching the components.
 *
 * Demo data (OTP is always 123456):
 *  - 0000000000  account not found
 *  - 1111111111  nothing outstanding: no utility bill, no outstanding information
 *  - 9999999999  everything works until submit, which fails
 *  - any other   needs a utility bill and has outstanding information
 */
export const DEMO_OTP = "123456";
const UNKNOWN_ACCOUNT = "0000000000";
const UP_TO_DATE_ACCOUNT = "1111111111";
const FAILING_ACCOUNT = "9999999999";

export class ApiError extends Error {
  readonly code: "ACCOUNT_NOT_FOUND" | "INVALID_OTP" | "SUBMISSION_FAILED";
  constructor(code: ApiError["code"], message: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type OtpContact = { maskedPhone: string; maskedEmail: string };

/** What the bank still needs from this account, returned once the OTP is confirmed. */
export type AccountRequirements = {
  utilityBillRequired: boolean;
  outstandingFields: { name: OutstandingFieldName; required: boolean }[];
};

export type VerificationResult = {
  accountNumber: string;
  customerName: string;
  requirements: AccountRequirements;
};

export async function requestOtp(accountNumber: string): Promise<OtpContact> {
  await delay(800);
  if (accountNumber === UNKNOWN_ACCOUNT) {
    throw new ApiError("ACCOUNT_NOT_FOUND", "We couldn't find an account with this number.");
  }
  return { maskedPhone: "+23480******78", maskedEmail: "ade****yu@gmail.com" };
}

export async function verifyOtp(accountNumber: string, otp: string): Promise<VerificationResult> {
  await delay(700);
  if (otp !== DEMO_OTP) {
    throw new ApiError("INVALID_OTP", "The OTP code entered is wrong or invalid.");
  }
  const upToDate = accountNumber === UP_TO_DATE_ACCOUNT;
  return {
    accountNumber,
    customerName: "Adeola Ayoyemi",
    requirements: upToDate
      ? { utilityBillRequired: false, outstandingFields: [] }
      : {
          utilityBillRequired: true,
          outstandingFields: [
            { name: "occupation", required: true },
            { name: "natureOfBusiness", required: true },
            { name: "employerName", required: false },
            { name: "employerAddress", required: false },
            { name: "annualTurnover", required: false },
          ],
        },
  };
}

export type IdUpdateSubmission = {
  accountNumber: string;
  consentAcceptedAt: string;
  termsAccepted: true;
  nin: string;
  documentType: string;
  documentNumber: string;
  front: File;
  back: File | null;
  utilityBill: File | null;
  outstanding: Partial<Record<OutstandingFieldName, string>>;
};

export async function submitIdUpdate(submission: IdUpdateSubmission): Promise<{ reference: string }> {
  // A real implementation would POST this as multipart/form-data.
  const body = new FormData();
  for (const [key, value] of Object.entries(submission)) {
    if (value === null) continue;
    body.append(key, value instanceof File ? value : typeof value === "object" ? JSON.stringify(value) : String(value));
  }
  await delay(1500);
  if (submission.accountNumber === FAILING_ACCOUNT) {
    throw new ApiError("SUBMISSION_FAILED", "Your update request failed.");
  }
  return { reference: `IDU-${Date.now().toString(36).toUpperCase()}` };
}

export function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  return "Something went wrong. Please check your connection and try again.";
}
