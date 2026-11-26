import { ArrowLeft } from "lucide-react";
import { Navigate, useNavigate } from "react-router";
import Button from "../../components/Button";
import { findDocumentType } from "../../features/id-document-update/documentTypes";
import { useIdUpdateFlow } from "../../features/id-document-update/flowState";
import TermsText from "../../features/id-document-update/TermsText";
import { paths } from "../../routes/paths";

/** Account Maintenance Terms and Conditions. Agreeing ticks the checkbox on the form. */
export default function TermsPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useIdUpdateFlow();

  // Only reachable from the form, after the account is verified.
  if (!state.verification) {
    return <Navigate to={paths.identityDocumentUpdate.details} replace />;
  }

  /** Return to the form. Going back in history restores its scroll position. */
  function returnToForm() {
    const cameFromForm = (window.history.state as { idx?: number } | null)?.idx;
    if (cameFromForm) navigate(-1);
    else navigate(paths.identityDocumentUpdate.details, { replace: true });
  }

  function respond(accepted: boolean) {
    dispatch({ type: accepted ? "terms/accepted" : "terms/declined" });
    returnToForm();
  }

  return (
    <article
      aria-labelledby="terms-heading"
      className="mx-auto min-h-[635px] max-w-[69.5rem] pt-2"
    >
      <title>Terms and Conditions | Identity Document Update</title>

      <button
        type="button"
        onClick={returnToForm}
        aria-label="Back to the form"
        className="-m-1 cursor-pointer rounded p-1 text-black hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-brand-link"
      >
        <ArrowLeft aria-hidden className="size-7" strokeWidth={1.75} />
      </button>

      <h1
        id="terms-heading"
        className="mt-8 text-[31.72px] leading-tight font-medium text-black sm:text-3xl"
      >
        Account Maintenance Terms and Conditions
      </h1>

      <div className="mt-5">
        <TermsText
          customerName={state.verification.customerName}
          accountNumber={state.verification.accountNumber}
          documentTypeLabel={
            findDocumentType(state.form.values.documentType)?.label ?? "—"
          }
        />
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:flex">
        <Button
          variant="outline"
          onClick={() => respond(false)}
          className="w-full sm:w-48"
        >
          I Reject
        </Button>
        <Button
          variant="solid"
          onClick={() => respond(true)}
          className="w-full sm:w-48"
        >
          I Agree
        </Button>
      </div>
    </article>
  );
}
