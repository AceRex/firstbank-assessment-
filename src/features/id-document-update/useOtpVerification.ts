import { useCallback, useReducer, useRef } from "react";
import { errorMessage, requestOtp, verifyOtp, type OtpContact, type VerificationResult } from "./api";
import { ACCOUNT_NUMBER_LENGTH, OTP_LENGTH, validateAccountNumber } from "./validation";

export const MAX_OTP_ATTEMPTS = 3;
export const RESEND_COOLDOWN_MS = 60_000;

export type OtpStatus =
  | "idle" // waiting for a full account number
  | "sending" // requesting an OTP for the account
  | "awaiting" // OTP sent, waiting for the customer to type it
  | "verifying" // checking the typed OTP
  | "verified" // OTP accepted
  | "locked"; // too many wrong attempts — must request a new OTP

type State = {
  account: string;
  accountError: string | null;
  status: OtpStatus;
  contact: OtpContact | null;
  digits: string[];
  otpError: string | null;
  attempts: number;
  resendAvailableAt: number | null;
  /** "OTP Validation Failed" dialog, opened when the attempt limit is reached. */
  lockNoticeOpen: boolean;
};

type Action =
  | { type: "account/changed"; account: string }
  | { type: "otp/sending" }
  | { type: "otp/sent"; contact: OtpContact; resendAvailableAt: number }
  | { type: "otp/sendFailed"; message: string }
  | { type: "digits/changed"; digits: string[] }
  | { type: "otp/verifying" }
  | { type: "otp/rejected"; message: string }
  | { type: "otp/verified" }
  | { type: "lockNotice/closed" };

const emptyDigits = () => Array<string>(OTP_LENGTH).fill("");

function createState(verifiedAccount: string | null): State {
  return {
    account: verifiedAccount ?? "",
    accountError: null,
    status: verifiedAccount ? "verified" : "idle",
    contact: null,
    digits: emptyDigits(),
    otpError: null,
    attempts: 0,
    resendAvailableAt: null,
    lockNoticeOpen: false,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "account/changed":
      // A different account invalidates any OTP already sent.
      return { ...createState(null), account: action.account };
    case "otp/sending":
      return { ...state, status: "sending", accountError: null, otpError: null };
    case "otp/sent":
      return {
        ...state,
        status: "awaiting",
        contact: action.contact,
        digits: emptyDigits(),
        attempts: 0,
        otpError: null,
        resendAvailableAt: action.resendAvailableAt,
      };
    case "otp/sendFailed":
      // Before an OTP exists the error belongs to the account field; afterwards (a failed resend) to the OTP.
      return state.contact
        ? { ...state, status: state.attempts >= MAX_OTP_ATTEMPTS ? "locked" : "awaiting", otpError: action.message }
        : { ...state, status: "idle", accountError: action.message };
    case "digits/changed":
      return { ...state, digits: action.digits, otpError: null };
    case "otp/verifying":
      return { ...state, status: "verifying", otpError: null };
    case "otp/rejected": {
      const attempts = state.attempts + 1;
      const locked = attempts >= MAX_OTP_ATTEMPTS;
      return {
        ...state,
        attempts,
        status: locked ? "locked" : "awaiting",
        otpError: action.message,
        // Once locked, let the customer request a fresh code straight away.
        resendAvailableAt: locked ? Date.now() : state.resendAvailableAt,
        lockNoticeOpen: locked,
      };
    }
    case "otp/verified":
      return { ...state, status: "verified", otpError: null };
    case "lockNotice/closed":
      return { ...state, lockNoticeOpen: false };
  }
}

/**
 * Account number + phone OTP verification.
 * Owns the state machine and the API calls; the component only renders it.
 */
export function useOtpVerification({
  verifiedAccount,
  onVerified,
}: {
  verifiedAccount: string | null;
  onVerified: (result: VerificationResult) => void;
}) {
  const [state, dispatch] = useReducer(reducer, verifiedAccount, createState);
  // Incremented on every request so responses for an outdated account are ignored.
  const requestId = useRef(0);

  const sendOtp = useCallback(async (account: string) => {
    const id = ++requestId.current;
    dispatch({ type: "otp/sending" });
    try {
      const contact = await requestOtp(account);
      if (id !== requestId.current) return;
      dispatch({ type: "otp/sent", contact, resendAvailableAt: Date.now() + RESEND_COOLDOWN_MS });
    } catch (error) {
      if (id !== requestId.current) return;
      dispatch({ type: "otp/sendFailed", message: errorMessage(error) });
    }
  }, []);

  const changeAccount = useCallback(
    (account: string) => {
      requestId.current++; // cancel any in-flight request for the previous number
      dispatch({ type: "account/changed", account });
      if (account.length === ACCOUNT_NUMBER_LENGTH && !validateAccountNumber(account)) {
        void sendOtp(account);
      }
    },
    [sendOtp],
  );

  const changeDigits = useCallback(
    async (digits: string[]) => {
      dispatch({ type: "digits/changed", digits });
      const code = digits.join("");
      if (code.length !== OTP_LENGTH) return;

      const id = ++requestId.current;
      dispatch({ type: "otp/verifying" });
      try {
        const result = await verifyOtp(state.account, code);
        if (id !== requestId.current) return;
        dispatch({ type: "otp/verified" });
        onVerified(result);
      } catch (error) {
        if (id !== requestId.current) return;
        dispatch({ type: "otp/rejected", message: errorMessage(error) });
      }
    },
    [state.account, onVerified],
  );

  const resend = useCallback(() => sendOtp(state.account), [sendOtp, state.account]);
  const closeLockNotice = useCallback(() => dispatch({ type: "lockNotice/closed" }), []);

  return { state, changeAccount, changeDigits, resend, closeLockNotice };
}
