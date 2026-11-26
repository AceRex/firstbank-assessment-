import { findDocumentType } from "./documentTypes";

/** Pure validators: return an error message, or null when the value is valid. */

export const ACCOUNT_NUMBER_LENGTH = 10;
export const NIN_LENGTH = 11;
export const OTP_LENGTH = 6;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export const digitsOnly = (value: string) => value.replace(/\D/g, "");

export function validateAccountNumber(value: string) {
  if (!value) return "Enter your account number.";
  if (!/^\d{10}$/.test(value)) return `Account number must be ${ACCOUNT_NUMBER_LENGTH} digits.`;
  return null;
}

export function validateNin(value: string) {
  if (!value) return "Enter your NIN.";
  if (!/^\d{11}$/.test(value)) return `NIN must be ${NIN_LENGTH} digits.`;
  return null;
}

export function validateDocumentType(value: string) {
  return findDocumentType(value) ? null : "Choose an identity document type.";
}

export function normaliseDocumentNumber(value: string) {
  return value.replace(/\s/g, "").toUpperCase();
}

export function validateDocumentNumber(value: string, documentType: string) {
  if (!value) return "Enter the identity document number.";
  const type = findDocumentType(documentType);
  if (!type) return null; // type error is reported on the type field
  if (!type.pattern.test(value)) return `Enter a valid ${type.label} number (${type.formatHint}).`;
  return null;
}

const ALLOWED_EXTENSIONS = /\.(pdf|jpe?g)$/i;
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg"];

/** `what` completes "Upload …", e.g. "the front of your identity document". */
export function validateFile(file: File | null, { required, what }: { required: boolean; what: string }) {
  if (!file) return required ? `Upload ${what}.` : null;
  const typeOk = ALLOWED_MIME_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.test(file.name);
  if (!typeOk) return "Unsupported file. Upload a PDF or JPG.";
  if (file.size === 0) return "This file is empty. Choose another file.";
  if (file.size > MAX_FILE_BYTES) return "File is larger than 10MB. Choose a smaller file.";
  return null;
}

export function validateRequiredSelect(value: string, { required, label }: { required: boolean; label: string }) {
  return required && !value ? `Select your ${label.toLowerCase()}.` : null;
}

export function validateText(
  value: string,
  { required, label, maxLength }: { required: boolean; label: string; maxLength: number },
) {
  const trimmed = value.trim();
  if (!trimmed) return required ? `Enter your ${label.toLowerCase()}.` : null;
  if (trimmed.length > maxLength) return `${label} must be ${maxLength} characters or fewer.`;
  return null;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
