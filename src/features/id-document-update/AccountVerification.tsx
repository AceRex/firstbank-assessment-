import { Check, LoaderCircle, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { ErrorDot } from "../../components/form/FieldError";
import TextField from "../../components/form/TextField";
import StatusDialog from "../../components/StatusDialog";
import type { VerificationResult } from "./api";
import OtpInput from "./OtpInput";
import { formatCountdown, useCountdown } from "./useCountdown";
import { useOtpVerification } from "./useOtpVerification";
import { ACCOUNT_NUMBER_LENGTH, digitsOnly } from "./validation";

/** How long the green tick shows before the rest of the form is revealed. */
const REVEAL_DELAY_MS = 900;

type AccountVerificationProps = {
  verifiedAccount: string | null;
  onVerified: (result: VerificationResult) => void;
  onCancelRequest: () => void;
};

export default function AccountVerification({ verifiedAccount, onVerified, onCancelRequest }: AccountVerificationProps) {
  // Holds the result while the tick shows, before the parent swaps in the form.
  const [justVerified, setJustVerified] = useState<VerificationResult | null>(null);
  const { state, changeAccount, changeDigits, resend, closeLockNotice } = useOtpVerification({
    verifiedAccount,
    onVerified: setJustVerified,
  });
  const secondsToResend = useCountdown(state.resendAvailableAt);

  // Tick → short pause → reveal the document form.
  useEffect(() => {
    if (!justVerified) return;
    const timer = window.setTimeout(() => onVerified(justVerified), REVEAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [justVerified, onVerified]);

  const otpSent = state.contact !== null;
  const isVerified = state.status === "verified";
  const showOtpSection = !verifiedAccount; // hidden once the parent has revealed the form
  const otpDisabled = !otpSent || state.status === "verifying" || state.status === "locked" || isVerified;
  const canResend = otpSent && secondsToResend === 0 && state.status !== "sending" && !isVerified;

  return (
    <>
      <div className="relative">
        <TextField
          id="account-number"
          label="Account number"
          placeholder={`Enter your ${ACCOUNT_NUMBER_LENGTH}-digit account number`}
          inputMode="numeric"
          autoComplete="off"
          maxLength={ACCOUNT_NUMBER_LENGTH}
          value={state.account}
          readOnly={isVerified || Boolean(verifiedAccount)}
          onChange={(event) => changeAccount(digitsOnly(event.target.value).slice(0, ACCOUNT_NUMBER_LENGTH))}
          error={state.accountError}
        />
        {state.status === "sending" && !otpSent && (
          <LoaderCircle
            aria-label="Sending OTP"
            className="absolute right-4 bottom-[18px] size-6 animate-spin text-brand-ink"
          />
        )}
      </div>

      {showOtpSection && (
        <section aria-labelledby="otp-label" className="mt-8">
          <p id="otp-label" className="mb-3 text-base leading-none font-light text-gray-600">
            Phone number verification
          </p>

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <div className="flex items-center gap-4">
              <OtpInput
                digits={state.digits}
                onChange={changeDigits}
                disabled={otpDisabled}
                invalid={Boolean(state.otpError)}
                labelledBy="otp-label"
                describedBy="otp-help"
                focusSignal={state.resendAvailableAt}
              />
              {state.status === "verifying" && (
                <LoaderCircle aria-label="Verifying OTP" className="size-7 animate-spin text-brand-ink" />
              )}
              {isVerified && (
                <Check aria-label="Phone number verified" className="size-8 text-brand-success" strokeWidth={2.5} />
              )}
            </div>

            {otpSent && !isVerified && (
              <p className="text-lg leading-none font-normal text-gray-900">
                Didn’t receive OTP?{" "}
                <button
                  type="button"
                  onClick={resend}
                  disabled={!canResend}
                  className="cursor-pointer text-brand-link underline decoration-from-font disabled:cursor-default"
                >
                  {state.status === "sending"
                    ? "Sending…"
                    : secondsToResend > 0
                      ? `Resend in ${formatCountdown(secondsToResend)}`
                      : "Resend OTP"}
                </button>
              </p>
            )}
          </div>

          {state.otpError && (
            <p role="alert" className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-lg text-error">
              <ErrorDot />
              <span>
                {state.status === "locked" ? "Too many wrong attempts. Request a new OTP to continue." : state.otpError}
              </span>
              <button
                type="button"
                onClick={onCancelRequest}
                className="cursor-pointer text-brand-link underline decoration-from-font"
              >
                Cancel Request
              </button>
            </p>
          )}

          {!isVerified && (
            <p id="otp-help" className="mt-6 font-light text-gray-900">
              {otpSent ? (
                <>
                  Kindly input the {state.digits.length}-digit OTP sent to your registered phone number{" "}
                  {state.contact?.maskedPhone} and email address {state.contact?.maskedEmail}
                </>
              ) : (
                "Enter your account number to receive a one-time password (OTP) on your registered phone number and email address."
              )}
            </p>
          )}
        </section>
      )}

      <StatusDialog
        open={state.lockNoticeOpen}
        onClose={closeLockNotice}
        icon={<TriangleAlert className="size-[50px] text-warning" strokeWidth={1.25} />}
        title="OTP Validation Failed"
        actions={
          <>
            <Button size="md" variant="outline" onClick={closeLockNotice} className="w-full">
              Close
            </Button>
            <Button size="md" variant="solid" onClick={onCancelRequest} className="w-full">
              Cancel request
            </Button>
          </>
        }
      >
        Your phone number validation failed.
      </StatusDialog>
    </>
  );
}
