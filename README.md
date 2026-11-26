# Digital Account Maintenance Portal: ID Document Update

A React web portal where bank customers update the identity document on their account. It covers consent, account verification by phone OTP, document upload, any extra documents or information the bank needs, terms acceptance and submission.

Built for the *Digital Account Maintenance Web App* case study (Snr. Analyst, Frontend Development).

---

## Quick start

Requires **Node.js 20.19+** (or 22.12+).

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check (`tsc -b`) and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint (including the React Hooks rules) |

## Trying the flow

There is no backend. [`api.ts`](src/features/id-document-update/api.ts) imitates one with realistic delays and failures. Use these demo values:

| Input | Result |
|---|---|
| OTP **`123456`** | Accepted. Any other code is rejected, and 3 wrong codes lock the OTP until a new one is requested. |
| Account **`0000000000`** | "We couldn't find an account with this number." |
| Account **`1111111111`** | Account is up to date: no utility bill or outstanding information is asked for. |
| Account **`9999999999`** | Everything works until **Submit**, which fails (shows the "Update request failed" dialog). |
| Any other 10 digits | Asks for a utility bill and has outstanding information to complete. |

Document number formats (checked per document type, in [`documentTypes.ts`](src/features/id-document-update/documentTypes.ts)):

| Document | Format | Example |
|---|---|---|
| International Passport | 1 letter + 8 digits | `A12345678` (back upload optional) |
| Driver's Licence | 12 letters/digits | `ABC12345AA11` |
| National ID Card | 11 digits | `12345678901` |
| Permanent Voter's Card | 19 letters/digits | `90F5AFB3A1295371234` |

Uploads accept **PDF or JPG up to 10MB**.

## The flow

```
Services page
   └─ "Update identification document"
        │
        ▼
1. Personal Data Processing Consent ── I Reject ──► back to services
        │ I Agree
        ▼
2. Account number ──► OTP sent (masked phone + email shown)
        │                 ├─ wrong OTP ──► inline error · "Cancel Request"
        │                 └─ 3 wrong   ──► "OTP Validation Failed" dialog
        │ OTP 123456 ✔
        ▼
3. NIN · document type · document number · front & back uploads
        │ (if the account needs it)
        ├──► "Additional document required" ── Upload now ──► utility bill upload
        │                                    └─ Skip for now
        ▼
4. ☐ Accept Terms & Conditions ──► Terms page ── I Agree ──► ☑ back on the form
        │ (if the account has gaps)
        ├──► "Please proceed to update information" ── Complete now ──► Outstanding Information
        ▼
5. Submit ──► "Submission successful" | "Update request failed"  (Close · Home)
```

Each later part of the form appears only when the earlier part is complete. In particular, the document fields stay hidden until the OTP is confirmed.

## Project structure

```
src/
├── routes/                  # Route table, path constants, lazy-page helper
├── layouts/                 # RootLayout (skip link, scroll restore) · SiteLayout (header/banner/footer)
│                            # IdUpdateFlowLayout (holds the flow's shared state)
├── pages/                   # One file per route — thin, they compose features
│   └── id-document-update/  # ConsentPage · DetailsPage · TermsPage
├── features/
│   ├── services/            # Landing-page service cards (data-driven)
│   └── id-document-update/  # Everything specific to this flow (see below)
├── components/              # Shared UI: Button, Modal, StatusDialog, form fields, header/footer…
└── config/site.ts           # Brand name, footer links, external URLs
```

Inside `features/id-document-update/`:

| File | Responsibility |
|---|---|
| `flowState.ts`, `IdUpdateFlowProvider.tsx` | Flow-wide state (reducer + context), session persistence |
| `useOtpVerification.ts` | OTP state machine: idle → sending → awaiting → verifying → verified / locked |
| `useIdDocumentForm.ts` | Form values, validation, and **which sections and dialogs are showing** |
| `validation.ts` | Validators (pure functions, no React) |
| `api.ts` | Mock backend: `requestOtp`, `verifyOtp`, `submitIdUpdate` |
| `documentTypes.ts`, `outstandingFields.ts` | Settings that drive the selects and their validation |
| `AccountVerification.tsx`, `OtpInput.tsx`, `IdDocumentForm.tsx`, `FileDropzone.tsx`, `TermsCheckbox.tsx` | UI pieces of the form |
| `RequireConsent.tsx`, `useExitFlow.ts` | Route guard, and leaving the flow cleanly |

## Design decisions

### State management
- **Flow state uses `useReducer` and context, provided by the flow's parent route.** The consent, form and terms pages are separate routes but share one state, so a customer can open the Terms page and come back without losing uploaded files. Leaving the flow removes the provider, which clears the state. No global store is needed for state that belongs to one flow.
- **The reducer is pure.** Timestamps and API results arrive in the action payload.
- **Dialogs and sections are calculated from state, not toggled by hand.** For example, "Additional document required" shows *when the ID documents are complete and the customer hasn't yet answered*. Nothing can get out of sync and there are no `useEffect` chains. See `deriveFormRules` in `useIdDocumentForm.ts`.
- **The OTP step has its own reducer**, a small state machine. It counts requests so that a slow reply for an old account number never overwrites a newer one.
- **Only consent is persisted**, in `sessionStorage`, which is cleared when the tab closes. A page refresh keeps consent but asks for the OTP again. Uploaded files, the verification and the form never leave memory.

### Requirements come from the API
`verifyOtp` returns what the account still needs (`utilityBillRequired`, `outstandingFields` with required flags). The UI reads that response, so supporting a new outstanding field is a settings entry in `outstandingFields.ts`, not new screen code.

### Error handling
- **Field checks** run when a field loses focus and again on submit. On submit, the page scrolls to and focuses the first invalid field. Errors are announced to screen readers (`role="alert"`, `aria-invalid`, `aria-describedby`).
- **Input is filtered as you type:** number-only fields drop other characters and are trimmed to their length, and document numbers are upper-cased. The code enforces these limits too, not just the browser's `maxLength`, which autofill can bypass.
- **Files are checked the moment they're chosen** (type, empty file, 10MB limit).
- **Every API call** has a loading state and a failure path, plus a generic message for network errors.
- **Route guards** stop customers skipping steps by URL (step 2 without consent, Terms without OTP).
- **Required dialogs can't be dismissed with Escape.** This works even in browsers that sometimes ignore a page's request to keep a dialog open.
- **Crashes:** the router's error page catches render errors.

### Responsiveness and accessibility
- Built mobile-first and checked at 375, 500, 1024, 1280 and 1512px wide.
- On small screens the OTP boxes shrink (48px instead of 60px), button pairs share the width, and the footer stacks.
- Native `<dialog>` handles focus trapping and Escape. There's a skip link and labelled controls, and the OTP boxes accept a pasted code and SMS autofill (`autocomplete="one-time-code"`).

### Performance
- Every page is its own chunk (`React.lazy`) with a skeleton loader shaped like the page. The ID flow is only downloaded when the customer starts it.
- Only the `lucide-react` icons actually used are bundled. No form or state libraries.
- Image previews use object URLs, which are released when no longer needed.

## Where this departs from the design

| Item | Decision |
|---|---|
| **Bank name** | The case study says *Logic Bank*; the Figma design and supplied logo are *FirstBank*. The UI follows the design. The name lives in `src/config/site.ts`. |
| Terms & Conditions copy | The design text is a template (`[Your Full Name]`, `[Bank's Name]`, account-opening wording). It's filled in with the customer's name, account and document type, and worded for maintenance. |
| Typos | "inputed" → "entered", "Bll" → "Bill", "10-digits" → "10-digit", "is failed" → "failed". |
| Resend timer | Shown as `0:56` (the design's "0.56 secs" read as a typo). |
| Before the OTP is sent | OTP boxes are disabled and a hint explains that a code will be sent. The design shows the masked contact details before an account number exists. |
| Uploaded file | Matches the design (paperclip, name, size), plus a small **×** to remove the file. The file name opens a preview. |
| Terms checkbox | Ticking it opens the Terms page; it's only ticked by pressing **I Agree** there, so the terms are always shown first. |
| Select options | Occupation, nature of business and turnover bands are placeholder lists, since the design shows single sample values. |
| Header/footer links, search, Help, Fibani | Placeholders (`#`). They're outside the scope of this flow. |
| Footer background art | Not included (no source asset). |

## Connecting a real backend

Replace the function bodies in [`api.ts`](src/features/id-document-update/api.ts) with `fetch` calls that keep the same signatures and throw `ApiError` on failure. `submitIdUpdate` already builds the `FormData` (multipart) body. The components only depend on the function signatures and the `AccountRequirements` / `VerificationResult` types.

Consent, the verification and the terms acceptance also have to be checked **on the server**. The client-side guards guide the customer; they are not a security control.

## Tech stack

React 19 · TypeScript · Vite · React Router · Tailwind CSS v4 · lucide-react
