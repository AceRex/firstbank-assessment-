import { useNavigate } from "react-router";
import Button from "../../components/Button";
import ConsentText from "../../features/id-document-update/ConsentText";
import { useIdUpdateFlow } from "../../features/id-document-update/flowState";
import { useExitFlow } from "../../features/id-document-update/useExitFlow";
import { paths } from "../../routes/paths";

export default function ConsentPage() {
  const navigate = useNavigate();
  const { dispatch } = useIdUpdateFlow();
  const exitFlow = useExitFlow();

  function handleAgree() {
    dispatch({ type: "consent/accepted", at: new Date().toISOString() });
    navigate(paths.identityDocumentUpdate.details);
  }

  // Rejecting consent leaves the flow and forgets anything saved for it.
  const handleReject = exitFlow;

  return (
    <section aria-labelledby="consent-heading" className="mx-auto min-h-[635px] max-w-[69.5rem] pt-2.5">
      <title>Consent Form | Identity Document Update</title>

      <h1
        id="consent-heading"
        className="text-2xl leading-none font-medium text-gray-950"
      >
        PERSONAL DATA PROCESSING CONSENT FORM
      </h1>
      <h2 className="mt-9 text-xl leading-none font-medium text-gray-950">
        Kindly read and accept the following conditions to proceed
      </h2>

      <div className="mt-4">
        <ConsentText />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:flex">
        <Button
          variant="outline"
          onClick={handleReject}
          className="w-full sm:w-48"
        >
          I Reject
        </Button>
        <Button
          variant="solid"
          onClick={handleAgree}
          className="w-full sm:w-48"
        >
          I Agree
        </Button>
      </div>
    </section>
  );
}
