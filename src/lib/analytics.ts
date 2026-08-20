export type AnalyticsEventName =
  | "challenge_started"
  | "answer_submitted"
  | "challenge_completed"
  | "challenge_retried"
  | "five_keys_opened"
  | "flow_vault_unlocked"
  | "download_clicked"
  | "paper_clicked"
  | "github_clicked"
  | "updates_submitted"
  | "share_clicked";

export type AnalyticsProperties = Readonly<
  Record<string, string | number | boolean>
>;

// Connect a privacy-conscious analytics tool here later. Never pass email
// addresses, patient information, or other personal/medical data to this helper.
export const trackEvent = (
  name: AnalyticsEventName,
  properties: AnalyticsProperties = {},
): void => {
  // Intentionally empty by default.
  void name;
  void properties;
};
