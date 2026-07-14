/** A single email-capture submission (popup, banner, or inline block). */
export interface LeadSubmission {
  email: string;
  /** Marketing consent, must be true to reach here (checkbox is required). */
  consent: boolean;
  /** Which surface captured it, for the sheet/CRM record. */
  source: "popup" | "banner" | "inline";
}

export interface LeadSinkResult {
  ok: boolean;
  /** Set when configured but the write itself failed. */
  error?: string;
}
