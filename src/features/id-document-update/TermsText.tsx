type TermsTextProps = {
  customerName: string;
  accountNumber: string;
  documentTypeLabel: string;
};

/**
 * Account Maintenance Terms and Conditions. The design's copy is a template with placeholders
 * ([Your Full Name], [Bank's Name], account-opening wording); they're filled in here for an
 * account maintenance request.
 */
export default function TermsText({
  customerName,
  accountNumber,
  documentTypeLabel,
}: TermsTextProps) {
  return (
    <div className="space-y-6 text-[21.15px] leading-[1.45] font-light text-gray-700 sm:text-xl">
      <p>
        I, {customerName}, hereby provide my consent to Logic Bank
        Limited (“Logic Bank”) to update the following on my account:
      </p>
      <ol className="list-inside list-decimal pl-1">
        <li>Account Number: {accountNumber}</li>
        <li>Service: Identity Document Update</li>
        <li>Identity Document: {documentTypeLabel}</li>
      </ol>
      <p>
        I understand and agree to abide by the terms and conditions set forth by
        Logic Bank, and I acknowledge receipt of the bank’s account agreement and
        related documents. I confirm that all information provided for this
        account maintenance request is true, accurate, and complete to the best
        of my knowledge.
      </p>
      <p>
        I authorize the bank to conduct any necessary background checks and
        verifications to assess my eligibility for maintaining the specified
        account. This includes, but is not limited to, obtaining credit reports,
        verifying employment details, and contacting references.
      </p>
      <p>
        I am aware that the account may be subject to applicable fees, charges,
        and terms as outlined by the bank, and I accept responsibility for any
        such fees incurred in connection with the account.
      </p>
      <p>
        I understand that the bank may provide electronic statements, notices,
        and other communications related to my account, and I consent to receive
        such communications electronically.
      </p>
      <p>
        I acknowledge that the account may be governed by the laws and
        regulations of the jurisdiction in which the bank operates, and I agree
        to comply with all applicable laws and regulations.
      </p>
      <p>
        I understand that the bank may update its terms and conditions from time
        to time, and I agree to be bound by the revised terms upon notification
        by the bank.
      </p>
      <p>
        I further authorize the bank to disclose information related to my
        account to its affiliates, agents, and regulatory authorities, as
        required by law or for the purpose of providing banking services.
      </p>
      <p>
        By selecting “I Agree” below, I acknowledge that I have read and
        understood the contents of these Account Maintenance Terms and
        Conditions, and I willingly provide my consent to Logic Bank.
      </p>
    </div>
  );
}
