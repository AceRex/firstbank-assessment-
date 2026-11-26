import { CircleCheck, CircleX, Info } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import Button from "../../components/Button";
import SelectField from "../../components/form/SelectField";
import TextField from "../../components/form/TextField";
import StatusDialog from "../../components/StatusDialog";
import { submitIdUpdate } from "./api";
import { documentTypes, findDocumentType } from "./documentTypes";
import FileDropzone from "./FileDropzone";
import type { FieldName } from "./formModel";
import { outstandingFieldConfig, type OutstandingFieldName } from "./outstandingFields";
import TermsCheckbox from "./TermsCheckbox";
import { useIdDocumentForm } from "./useIdDocumentForm";
import { digitsOnly, NIN_LENGTH, normaliseDocumentNumber } from "./validation";

type SubmitStatus = "idle" | "submitting" | "succeeded" | "failed";

export default function IdDocumentForm({ onExit }: { onExit: () => void }) {
  const form = useIdDocumentForm();
  const { values, errors, rules, setValue, touch } = form;
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [dialogOpen, setDialogOpen] = useState(false);
  const fieldRefs = useRef<Partial<Record<FieldName, HTMLElement | null>>>({});
  const outstandingHeadingRef = useRef<HTMLHeadingElement>(null);

  const documentType = findDocumentType(values.documentType);
  const submitting = status === "submitting";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting || status === "succeeded") return;

    const firstInvalid = form.validateAll();
    if (firstInvalid) {
      const field = fieldRefs.current[firstInvalid];
      field?.scrollIntoView({ behavior: "smooth", block: "center" });
      field?.focus({ preventScroll: true });
      return;
    }

    setStatus("submitting");
    try {
      await submitIdUpdate(form.toSubmission());
      setStatus("succeeded");
    } catch {
      setStatus("failed");
    }
    setDialogOpen(true);
  }

  function completeOutstanding() {
    form.revealOutstanding();
    // Bring the newly shown section into view once it has rendered.
    requestAnimationFrame(() => outstandingHeadingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-8" aria-busy={submitting}>
      {/* ---------- Identity document ---------- */}
      <TextField
        id="nin"
        label="NIN"
        placeholder="Enter your NIN"
        inputMode="numeric"
        autoComplete="off"
        maxLength={NIN_LENGTH}
        value={values.nin}
        onChange={(event) => setValue("nin", digitsOnly(event.target.value).slice(0, NIN_LENGTH))}
        onBlur={() => touch("nin")}
        error={errors.nin}
        ref={(element) => {
          fieldRefs.current.nin = element;
        }}
      />

      <SelectField
        id="document-type"
        label="Identity Document type"
        placeholder="Choose Identity Document type"
        options={documentTypes}
        value={values.documentType}
        onChange={(event) => {
          setValue("documentType", event.target.value);
          touch("documentType");
        }}
        onBlur={() => touch("documentType")}
        error={errors.documentType}
        ref={(element) => {
          fieldRefs.current.documentType = element;
        }}
      />

      <TextField
        id="document-number"
        label="Identity Document number"
        placeholder="Enter the Identity Document number"
        autoComplete="off"
        autoCapitalize="characters"
        maxLength={documentType?.maxLength ?? 19}
        value={values.documentNumber}
        onChange={(event) =>
          setValue(
            "documentNumber",
            normaliseDocumentNumber(event.target.value).slice(0, documentType?.maxLength ?? 19),
          )
        }
        onBlur={() => touch("documentNumber")}
        error={errors.documentNumber}
        ref={(element) => {
          fieldRefs.current.documentNumber = element;
        }}
      />

      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-2.5">
          <FileDropzone
            label="Upload your Identity Document (Front)"
            file={values.front}
            onChange={(file) => setValue("front", file)}
            error={errors.front}
            focusRef={(element) => {
          fieldRefs.current.front = element;
        }}
          />
          <FileDropzone
            label={documentType && !documentType.requiresBack ? "Back (optional)" : "Back"}
            file={values.back}
            onChange={(file) => setValue("back", file)}
            error={errors.back}
            focusRef={(element) => {
          fieldRefs.current.back = element;
        }}
          />
        </div>

        {rules.utilityBillVisible && (
          <div className="grid sm:grid-cols-2 sm:gap-2.5">
            <FileDropzone
              label="Upload your Utility Bill"
              file={values.utilityBill}
              onChange={(file) => setValue("utilityBill", file)}
              error={errors.utilityBill}
              focusRef={(element) => {
          fieldRefs.current.utilityBill = element;
        }}
            />
          </div>
        )}

        {!rules.termsVisible && (
          <p className="text-sm text-gray-900 italic">Document must be clear, legible and genuine. Upload uprightly</p>
        )}
      </div>

      {rules.termsVisible && <TermsCheckbox checked={form.termsAccepted} onUncheck={form.declineTerms} />}

      {/* ---------- Outstanding information ---------- */}
      {rules.outstandingVisible && (
        <section aria-labelledby="outstanding-heading" className="space-y-8 pt-4">
          <h2
            id="outstanding-heading"
            ref={outstandingHeadingRef}
            className="scroll-mt-6 text-xl leading-none font-normal text-gray-950"
          >
            Outstanding Information
          </h2>
          {rules.requirements.outstandingFields.map(({ name, required }) => (
            <OutstandingField
              key={name}
              name={name}
              required={required}
              value={values[name]}
              error={errors[name]}
              onChange={(value) => setValue(name, value)}
              onBlur={() => touch(name)}
              fieldRef={(element) => {
                fieldRefs.current[name] = element;
              }}
            />
          ))}
        </section>
      )}

      {rules.submitVisible && (
        <Button type="submit" size="md" disabled={submitting || status === "succeeded"} className="w-full sm:w-48">
          {submitting ? "Submitting…" : status === "succeeded" ? "Submitted" : "Submit"}
        </Button>
      )}

      {/* ---------- Dialogs ---------- */}
      <StatusDialog
        open={rules.utilityPromptOpen}
        icon={<Info className="size-[50px] text-brand-link" strokeWidth={1.75} />}
        title="Additional document required"
        actions={
          <>
            <Button size="md" variant="outline" onClick={() => form.chooseUtilityBill("skip")} className="w-full">
              Skip for now
            </Button>
            <Button size="md" onClick={() => form.chooseUtilityBill("upload")} className="w-full">
              Upload now
            </Button>
          </>
        }
      >
        Utility bill (less than six months)
      </StatusDialog>

      <StatusDialog
        open={rules.outstandingPromptOpen}
        title="Please proceed to update information on your account"
        actions={
          <Button size="md" onClick={completeOutstanding} className="w-full">
            Complete now
          </Button>
        }
      >
        <ul className="space-y-1.5 pl-12 text-left text-gray-600 sm:pl-14">
          {rules.requirements.outstandingFields.map(({ name, required }) => (
            <li key={name}>
              {outstandingFieldConfig[name].label}
              {required && (
                <>
                  {" "}
                  (<strong className="font-bold italic">compulsory</strong>
                  <span aria-hidden className="text-error">
                    *
                  </span>
                  )
                </>
              )}
            </li>
          ))}
        </ul>
      </StatusDialog>

      <StatusDialog
        open={dialogOpen && status === "succeeded"}
        onClose={() => setDialogOpen(false)}
        icon={<CircleCheck className="size-[50px] text-brand-success" strokeWidth={1.5} />}
        title="Submission successful"
        actions={
          <>
            <Button size="md" variant="outline" onClick={() => setDialogOpen(false)} className="w-full">
              Close
            </Button>
            <Button size="md" onClick={onExit} className="w-full">
              Home
            </Button>
          </>
        }
      >
        Your update request is in progress. It will be treated within 24 hours
      </StatusDialog>

      <StatusDialog
        open={dialogOpen && status === "failed"}
        onClose={() => setDialogOpen(false)}
        icon={<CircleX className="size-[50px] text-warning" strokeWidth={1.5} />}
        title="Update request failed"
        actions={
          <>
            <Button size="md" variant="outline" onClick={() => setDialogOpen(false)} className="w-full">
              Close
            </Button>
            <Button size="md" onClick={onExit} className="w-full">
              Home
            </Button>
          </>
        }
      >
        Your update request failed. Kindly visit the nearest branch
      </StatusDialog>
    </form>
  );
}

function OutstandingField({
  name,
  required,
  value,
  error,
  onChange,
  onBlur,
  fieldRef,
}: {
  name: OutstandingFieldName;
  required: boolean;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  fieldRef: (element: HTMLElement | null) => void;
}) {
  const config = outstandingFieldConfig[name];
  const id = `outstanding-${name}`;

  if (config.kind === "select") {
    return (
      <SelectField
        id={id}
        label={config.label}
        placeholder={config.placeholder}
        options={config.options}
        required={required}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          onBlur();
        }}
        onBlur={onBlur}
        error={error}
        ref={fieldRef}
      />
    );
  }
  return (
    <TextField
      id={id}
      label={config.label}
      placeholder={config.placeholder}
      required={required}
      maxLength={config.maxLength}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      error={error}
      ref={fieldRef}
    />
  );
}
