export const colors = {
  primary: "#501C2F",
  background: "#F2E8DE",
  card: "#FFFFFF",
  border: "#E2E8F0",
  borderStrong: "#CBD5E1",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#64748B",
  accent: "#43617A",
  successBg: "#ECFDF5",
  successBorder: "#A7F3D0",
  successText: "#065F46",
  errorBg: "#FEF2F2",
  errorBorder: "#FECACA",
  errorText: "#991B1B",
  tabActiveBg: "#600324",
  tabActiveText: "#FFFFFF",
  inputBg: "#F8FAFC",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  full: 999,
};

export const typography = {
  heading: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.textPrimary,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.textPrimary,
  },
  body: { fontSize: 15, color: colors.textPrimary },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
  },
  mono: { fontFamily: "monospace", fontSize: 15, color: colors.textPrimary },
  monoLarge: {
    fontFamily: "monospace",
    fontSize: 22,
    fontWeight: "700" as const,
    color: colors.textPrimary,
  },
};
