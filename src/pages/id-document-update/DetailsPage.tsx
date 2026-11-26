import { useCallback } from "react";
import AccountVerification from "../../features/id-document-update/AccountVerification";
import type { VerificationResult } from "../../features/id-document-update/api";
import FlowHeader from "../../features/id-document-update/FlowHeader";
import { useIdUpdateFlow } from "../../features/id-document-update/flowState";
import IdDocumentForm from "../../features/id-document-update/IdDocumentForm";
import { useExitFlow } from "../../features/id-document-update/useExitFlow";
import { paths } from "../../routes/paths";

/**
 * Step 2 of the flow: verify the account by phone OTP, then reveal the document form.
 * The document fields stay hidden until the OTP is confirmed.
 */
export default function DetailsPage() {
  const { state, dispatch } = useIdUpdateFlow();
  const exitFlow = useExitFlow();

  const handleVerified = useCallback(
    (verification: VerificationResult) => dispatch({ type: "account/verified", verification }),
    [dispatch],
  );

  const verifiedAccount = state.verification?.accountNumber ?? null;

  return (
    <div className="mx-auto min-h-[635px] max-w-[50.75rem] pt-1">
      <title>Identity Document Update | Logic Bank</title>
      <FlowHeader title="Identity Document Update" backTo={paths.identityDocumentUpdate.consent} />

      <div className="mt-12">
        <AccountVerification
          verifiedAccount={verifiedAccount}
          onVerified={handleVerified}
          onCancelRequest={exitFlow}
        />
        {verifiedAccount && <IdDocumentForm onExit={exitFlow} />}
      </div>
    </div>
  );
}
