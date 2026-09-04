export interface Feature {
  key: string;
  icon: string;
  title: string;
  description: string;
}

// Keys line up with the FeatureSettings toggles in the backend so the
// marketing copy and the account settings page describe the same features.
export const features: Feature[] = [
  {
    key: "linkScanning",
    icon: "🔗",
    title: "Real-time link scanning",
    description: "Every link you hover or click is checked against known phishing and scam databases instantly.",
  },
  {
    key: "formProtection",
    icon: "🔒",
    title: "Login form protection",
    description: "Get warned before typing a password or card number into a page pretending to be your bank or a trusted site.",
  },
  {
    key: "typosquatWarnings",
    icon: "🔤",
    title: "Typosquat detection",
    description: "Catches lookalike domains, like paypa1.com or arnazon.com, built to fool a quick glance.",
  },
  {
    key: "downloadScanning",
    icon: "⬇️",
    title: "Download scanning",
    description: "Flags risky downloads before they land on your device.",
  },
  {
    key: "communityReports",
    icon: "🐣",
    title: "Community reports",
    description: "See and contribute to a shared blocklist of scam sites reported by other Chick Check users.",
  },
  {
    key: "weeklyEmailSummary",
    icon: "📬",
    title: "Weekly protection summary",
    description: "A short weekly email recap of what Chick Check blocked for you.",
  },
];

export interface Plan {
  id: "free" | "pro";
  name: string;
  price: string;
  cadence: string;
  description: string;
  featureKeys: string[];
  cta: string;
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "Core protection for everyday browsing.",
    featureKeys: ["linkScanning", "formProtection", "typosquatWarnings"],
    cta: "Get started free",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$3",
    cadence: "/ month",
    description: "Full protection for downloads, and community intel.",
    featureKeys: ["linkScanning", "formProtection", "typosquatWarnings", "downloadScanning", "communityReports", "weeklyEmailSummary"],
    cta: "Upgrade to Pro",
  },
];
