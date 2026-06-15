import React from "react";
import {
  Dimensions,
  KeyboardTypeOptions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing, typography } from "../theme";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
}

const screenWidth = Dimensions.get("window").width;
const BUTTON_FONT_SIZE = Math.min(16, Math.max(12, screenWidth * 0.05));

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "numeric",
}: InputFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? "0"}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
      />
    </View>
  );
}

interface BtnProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  flex?: number;
}

export function Btn({ label, onPress, variant = "primary", flex }: BtnProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.btn,
        variant === "secondary" && styles.btnSecondary,
        flex !== undefined && { flex },
      ]}
    >
      <Text
        style={[
          styles.btnText,
          variant === "secondary" && styles.btnTextSecondary,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.75}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function SectionCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      {children}
    </View>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

export type TabId = "energy" | "transport" | "food" | "waste";

const TAB_LABELS: { id: TabId; label: string }[] = [
  { id: "energy", label: "Energia" },
  { id: "transport", label: "Transporte" },
  { id: "food", label: "Alimentação" },
  { id: "waste", label: "Resíduos" },
];

interface TabBarProps {
  active: TabId;
  onChange: (id: TabId) => void;
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabBar}
    >
      {TAB_LABELS.map(({ id, label }) => (
        <TouchableOpacity
          key={id}
          activeOpacity={0.75}
          onPress={() => onChange(id)}
          style={[styles.tab, active === id && styles.tabActive]}
        >
          <Text style={[styles.tabText, active === id && styles.tabTextActive]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  input: {
    height: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    paddingHorizontal: spacing.md,
    ...typography.mono,
    fontSize: 16,
    color: colors.textPrimary,
  },
  btn: {
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xs,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  btnSecondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnText: {
    fontSize: BUTTON_FONT_SIZE,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  btnTextSecondary: {
    color: colors.textPrimary,
    fontSize: BUTTON_FONT_SIZE,
  },
  resultBox: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
  },
  resultOk: {
    borderColor: colors.successBorder,
  },
  resultError: {
    borderColor: colors.errorBorder,
  },
  resultBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  resultBadgeOk: {
    backgroundColor: colors.successBg,
    color: colors.successText,
  },
  resultBadgeError: {
    backgroundColor: colors.errorBg,
    color: colors.errorText,
  },
  resultTitle: {
    ...typography.label,
    marginBottom: spacing.xs,
    color: colors.textSecondary,
  },
  resultTitleError: {
    color: colors.errorText,
  },
  resultValue: {
    ...typography.monoLarge,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },
  resultValueError: {
    ...typography.monoLarge,
    marginBottom: spacing.sm,
    color: colors.errorText,
  },
  stepsBox: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    gap: spacing.sm,
  },
  stepsBoxError: {
    borderColor: colors.errorBorder,
    backgroundColor: "#FEF3F2",
  },
  stepText: {
    ...typography.mono,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  stepTextError: {
    color: colors.errorText,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 2,
  },
  cardLabel: {
    ...typography.heading,
    marginBottom: spacing.md,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  tabBar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    flexDirection: "row",
    overflow: "hidden",
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    overflow: "hidden",
  },
  tabActive: {
    backgroundColor: colors.tabActiveBg,
    borderColor: colors.tabActiveBg,
  },
  tabText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  tabTextActive: {
    color: colors.tabActiveText,
  },
});
