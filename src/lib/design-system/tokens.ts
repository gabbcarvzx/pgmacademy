export const designTokens = {
  color: {
    backgroundPrimary: "var(--background-primary)",
    backgroundSecondary: "var(--background-secondary)",
    surface: "var(--surface)",
    surfaceElevated: "var(--surface-elevated)",
    accentGold: "var(--accent-gold)",
    accentGoldSoft: "var(--accent-gold-soft)",
    success: "var(--success)",
    warning: "var(--warning)",
    error: "var(--error)",
    textPrimary: "var(--text-primary)",
    textSecondary: "var(--text-secondary)",
    textMuted: "var(--text-muted)",
  },
  typography: {
    displayXl: {
      className: "text-display-xl",
      usage: "Landing heroes and major brand moments only.",
    },
    displayLg: {
      className: "text-display-lg",
      usage: "Premium marketing sections and high-impact empty states.",
    },
    h1: {
      className: "text-heading-1",
      usage: "Primary page title.",
    },
    h2: {
      className: "text-heading-2",
      usage: "Main section title.",
    },
    h3: {
      className: "text-heading-3",
      usage: "Card groups and dense section titles.",
    },
    bodyLarge: {
      className: "text-body-large",
      usage: "Lead copy and important explanations.",
    },
    body: {
      className: "text-body",
      usage: "Default reading text.",
    },
    caption: {
      className: "text-caption",
      usage: "Labels, metadata and supporting UI text.",
    },
  },
  spacing: {
    4: "var(--space-4)",
    8: "var(--space-8)",
    12: "var(--space-12)",
    16: "var(--space-16)",
    24: "var(--space-24)",
    32: "var(--space-32)",
    48: "var(--space-48)",
    64: "var(--space-64)",
    96: "var(--space-96)",
  },
  radius: {
    12: "var(--radius-12)",
    16: "var(--radius-16)",
    20: "var(--radius-20)",
    24: "var(--radius-24)",
  },
  shadow: {
    card: "var(--shadow-card)",
    elevated: "var(--shadow-elevated)",
    modal: "var(--shadow-modal)",
    premium: "var(--shadow-premium)",
  },
} as const;

export type DesignTokenCategory = keyof typeof designTokens;
