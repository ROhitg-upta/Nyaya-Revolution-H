/**
 * SPRINT E10 — SANITIZATION & INDIAN PII REDACTION ENGINE
 * Protects citizen privacy before publishing stories or comments and prevents XSS injection.
 */

import type { PIIWarningDetection } from "@/types/community";

const HTML_TAG_REGEX = /<\/?[^>]+(>|$)/g;
const SCRIPT_PROTOCOL_REGEX = /javascript:|data:text\/html|vbscript:/gi;

// Indian PII Patterns
const AADHAAR_REGEX = /\b[2-9]{1}[0-9]{3}[\s-]?[0-9]{4}[\s-]?[0-9]{4}\b/g;
const INDIAN_PHONE_REGEX = /(?:\+91[\s-]?)?[6-9]\d{9}\b/g;
const PAN_CARD_REGEX = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g;
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const BANK_ACCOUNT_REGEX = /\b\d{11,16}\b/g;

/**
 * Strips raw HTML tags, script protocols, and normalizes whitespace to prevent XSS.
 */
export function sanitizeUserText(input: string): string {
  if (!input) return "";
  return input
    .replace(SCRIPT_PROTOCOL_REGEX, "")
    .replace(HTML_TAG_REGEX, "")
    .replace(/\u0000/g, "")
    .trim();
}

/**
 * Sanitizes a filename to prevent path traversal or unsafe shell/storage characters.
 */
export function sanitizeStorageFileName(fileName: string): string {
  const baseName = fileName.replace(/^.*[\\/]/, ""); // strip path traversal ../ or \
  return baseName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/**
 * Generates a URL-safe unique slug for a citizen story.
 */
export function generateStorySlug(title: string, suffix?: string): string {
  const cleanTitle = sanitizeUserText(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 64);

  const uniquePart = suffix || Math.random().toString(36).substring(2, 7);
  return `${cleanTitle || "citizen-story"}-${uniquePart}`;
}

/**
 * Detects sensitive personal identifiers (Aadhaar, Phone, PAN, Email, Bank Account)
 * and provides a redacted preview so citizens do not accidentally doxx themselves or others.
 */
export function detectAndRedactPII(rawText: string): PIIWarningDetection {
  const detectedTypes = new Set<
    "aadhaar" | "phone" | "pan" | "email" | "bank_account"
  >();
  const warningMessages: string[] = [];
  let redactedPreview = rawText;

  if (AADHAAR_REGEX.test(rawText)) {
    detectedTypes.add("aadhaar");
    warningMessages.push(
      "Possible 12-digit Aadhaar number detected. Never share Aadhaar numbers in public stories."
    );
    redactedPreview = redactedPreview.replace(
      AADHAAR_REGEX,
      "[REDACTED-AADHAAR]"
    );
  }

  if (INDIAN_PHONE_REGEX.test(rawText)) {
    detectedTypes.add("phone");
    warningMessages.push(
      "Indian mobile number detected. Remove personal phone numbers to protect against spam or harassment."
    );
    redactedPreview = redactedPreview.replace(
      INDIAN_PHONE_REGEX,
      "[REDACTED-PHONE]"
    );
  }

  if (PAN_CARD_REGEX.test(rawText)) {
    detectedTypes.add("pan");
    warningMessages.push(
      "PAN card identifier detected. Avoid sharing financial identity numbers."
    );
    redactedPreview = redactedPreview.replace(PAN_CARD_REGEX, "[REDACTED-PAN]");
  }

  if (EMAIL_REGEX.test(rawText)) {
    detectedTypes.add("email");
    warningMessages.push(
      "Email address detected. We recommend removing personal email addresses from public narratives."
    );
    redactedPreview = redactedPreview.replace(EMAIL_REGEX, "[REDACTED-EMAIL]");
  }

  if (BANK_ACCOUNT_REGEX.test(rawText)) {
    detectedTypes.add("bank_account");
    warningMessages.push(
      "Long numeric sequence (possible Bank Account / Transaction ID) detected. Consider masking digits."
    );
    redactedPreview = redactedPreview.replace(
      BANK_ACCOUNT_REGEX,
      "[REDACTED-ACCOUNT-NO]"
    );
  }

  return {
    hasPII: detectedTypes.size > 0,
    detectedTypes: Array.from(detectedTypes),
    redactedPreview,
    warningMessages,
  };
}
