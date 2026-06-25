import React, { useContext, useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing, typography } from "./src/theme";

import { LinearGradient } from "expo-linear-gradient";
import Sparkles from "./src/assets/svg/sparkles";
import { NavigationHeader } from "./src/components/header";
import { CarbonContext, CarbonProvider } from "./src/contexts/CarbonContext";
import ChatModal from "./src/screens/ChatModal";
import { HomeScreen } from "./src/screens/HomeScreen";

export default function App() {
  const [chatVisible, setChatVisible] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [usageVisible, setUsageVisible] = useState(false);
  const animX = React.useRef(new Animated.Value(40)).current;
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width,
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = windowWidth >= 1024;

  useEffect(() => {
    let showTimeout: NodeJS.Timeout | null = null;
    let hideTimeout: NodeJS.Timeout | null = null;

    const schedule = () => {
      const delay = 4000 + Math.random() * 6000;
      showTimeout = setTimeout(() => {
        setHintVisible(true);
        // animate in
        animX.setValue(40);
        Animated.timing(animX, {
          toValue: 0,
          duration: 420,
          useNativeDriver: true,
        }).start();

        hideTimeout = setTimeout(() => {
          Animated.timing(animX, {
            toValue: 40,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setHintVisible(false));
        }, 5000);

        schedule();
      }, delay);
    };

    schedule();

    return () => {
      if (showTimeout) clearTimeout(showTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
      animX.stopAnimation();
    };
  }, [animX]);

  return (
    <View style={{ flex: 1 }}>
      <NavigationHeader />
      <LinearGradient
        colors={["#F7F1EB", "#EFE5DC", "#E6D8CC"]}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
          <CarbonProvider>
            <StatusBar
              barStyle="dark-content"
              backgroundColor={colors.background}
            />

            <View
              style={[
                styles.contentContainer,
                isDesktop && styles.desktopContentContainer,
                styles.screenPadding,
              ]}
            >
              {!isDesktop && (
                <View style={styles.mobileUsageWrapper}>
                  <TouchableOpacity
                    onPress={() => setUsageVisible((visible) => !visible)}
                    style={styles.usageButton}
                  >
                    <Text style={styles.usageButtonText}>Como usar?</Text>
                  </TouchableOpacity>

                  {usageVisible && <UsageGuide />}
                </View>
              )}

              <View style={styles.pageHeader}>
                <Text style={typography.heading}>Calculadora de Carbono</Text>
                <Text style={{ fontSize: 15, color: colors.textSecondary }}>
                  Descubra sua pegada de carbono mensal.
                </Text>
              </View>

              {isDesktop ? (
                <View style={styles.desktopCalculatorLayout}>
                  <View style={styles.calculatorColumn}>
                    <HomeScreen />
                  </View>
                  <View style={styles.usageColumn}>
                    <UsageGuide />
                  </View>
                </View>
              ) : (
                <HomeScreen />
              )}
            </View>

            {hintVisible && (
              <Animated.View
                style={[
                  styles.hintBubble,
                  {
                    transform: [{ translateX: animX }],
                    opacity: animX.interpolate({
                      inputRange: [0, 40],
                      outputRange: [1, 0],
                    }),
                  },
                ]}
                pointerEvents="none"
              >
                <Text style={styles.hintText}>
                  Dúvidas? Nossa IA pode ajudar!
                </Text>

                <View style={styles.hintArrow} />
              </Animated.View>
            )}

            <TouchableOpacity
              style={styles.cornerDot}
              onPress={() => setChatVisible(true)}
            >
              <Sparkles color="white" />
            </TouchableOpacity>

            <ChatWithContext
              visible={chatVisible}
              onClose={() => setChatVisible(false)}
            />
          </CarbonProvider>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

function UsageGuide() {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpen((prev) => (prev === key ? null : key));
  };

  return (
    <View style={styles.usageInfo}>
      <Text style={styles.usageEyebrow}>Passo a passo</Text>

      <Text style={styles.usageTitle}>Como usar a Calculadora de Carbono</Text>

      <Text style={styles.usageText}>
        Essa calculadora estima o impacto ambiental das suas atividades do dia a
        dia. Ela funciona assim: você informa alguns hábitos da sua rotina e o
        sistema transforma esses dados em uma estimativa de emissão de gases que
        contribuem para o aquecimento global.
      </Text>

      <TouchableOpacity onPress={() => toggle("how")}>
        <Text style={styles.usageStepTitle}>
          {open === "how" ? "▼" : "▶"} Como funciona
        </Text>
      </TouchableOpacity>

      {open === "how" && (
        <Text style={styles.usageText}>
          Cada atividade (energia, transporte, alimentação e lixo) tem um peso
          diferente. A calculadora soma tudo para gerar o impacto mensal.
        </Text>
      )}
      <TouchableOpacity onPress={() => toggle("values")}>
        <Text style={styles.usageStepTitle}>
          {open === "values" ? "▼" : "▶"} Como o impacto é calculado
        </Text>
      </TouchableOpacity>

      {open === "values" && (
        <>
          <Text style={styles.usageText}>
            Esses são os valores usados como base na conta:
          </Text>
          <Text style={styles.usageText}>
            Energia elétrica: 0,084/kWh{"\n"}
            Gás: 2,98/kg{"\n"}
            Gasolina: 2,31/L{"\n"}
            Diesel: 2,68/L{"\n"}
            Avião: 0,255/km{"\n"}
            Carne bovina: 27/kg{"\n"}
            Carne suína: 12/kg{"\n"}
            Frango: 6,9/kg{"\n"}
            Laticínios: 1,9/kg{"\n"}
            Vegetais: 2,0/kg{"\n"}
            Lixo: 2,0/kg (com reciclagem)
          </Text>
        </>
      )}

      <TouchableOpacity onPress={() => toggle("energy")}>
        <Text style={styles.usageStepTitle}>
          {open === "energy" ? "▼" : "▶"} 1. Energia de casa
        </Text>
      </TouchableOpacity>

      {open === "energy" && (
        <Text style={styles.usageText}>
          Calcula o impacto da energia elétrica e gás. Quanto maior o consumo,
          maior a emissão.
        </Text>
      )}

      <TouchableOpacity onPress={() => toggle("transport")}>
        <Text style={styles.usageStepTitle}>
          {open === "transport" ? "▼" : "▶"} 2. Transporte
        </Text>
      </TouchableOpacity>

      {open === "transport" && (
        <Text style={styles.usageText}>
          O sistema estima o impacto do combustível usado em carros, motos e
          aviões. Cada tipo de transporte tem um nível diferente de emissão de
          poluentes.
        </Text>
      )}

      <TouchableOpacity onPress={() => toggle("food")}>
        <Text style={styles.usageStepTitle}>
          {open === "food" ? "▼" : "▶"} 3. Alimentação
        </Text>
      </TouchableOpacity>

      {open === "food" && (
        <Text style={styles.usageText}>
          Os alimentos são convertidos em impacto ambiental de acordo com o tipo
          de produção. Carnes e laticínios tendem a gerar mais emissões do que
          vegetais.
        </Text>
      )}

      <TouchableOpacity onPress={() => toggle("waste")}>
        <Text style={styles.usageStepTitle}>
          {open === "waste" ? "▼" : "▶"} 4. Lixo (resíduos)
        </Text>
      </TouchableOpacity>

      {open === "waste" && (
        <Text style={styles.usageText}>
          O impacto do lixo é calculado com base na quantidade gerada. Se você
          recicla parte dele, o impacto final diminui automaticamente.
        </Text>
      )}

      <TouchableOpacity onPress={() => toggle("result")}>
        <Text style={styles.usageStepTitle}>
          {open === "result" ? "▼" : "▶"} 5. Resultado final
        </Text>
      </TouchableOpacity>

      {open === "result" && (
        <Text style={styles.usageText}>
          A calculadora junta todos esses impactos (energia + transporte +
          alimentação + lixo) e mostra uma estimativa total do seu impacto
          mensal. O botão “Reiniciar” permite refazer tudo com novos valores.
        </Text>
      )}
    </View>
  );
}
function ChatWithContext({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const ctx = useContext(CarbonContext);

  if (!ctx) return <ChatModal visible={visible} onClose={onClose} />;

  const {
    energyInputs,
    transportInputs,
    foodInputs,
    wasteInputs,
    energy,
    transport,
    food,
    waste,
    total,
  } = ctx;

  const fmt = (v: any) =>
    v === undefined || v === null || v === "" ? "-" : String(v);

  const parts: string[] = [];
  parts.push("Entradas e resultados do usuário:");

  parts.push(
    `Energia: Eletricidade=${fmt(energyInputs?.electricity)} kWh, Gás=${fmt(energyInputs?.gas)} kg. Resultado=${energy !== null ? energy.toFixed(2) + " kg CO₂e" : "-"}`,
  );

  parts.push(
    `Transporte: Gasolina=${fmt(transportInputs?.gasoline)} L, Diesel=${fmt(transportInputs?.diesel)} L, Avião=${fmt(transportInputs?.airplaneKm)} km. Resultado=${transport !== null ? transport.toFixed(2) + " kg CO₂e" : "-"}`,
  );

  parts.push(
    `Alimentação: Carne bovina=${fmt(foodInputs?.beef)} kg, Carne suína=${fmt(foodInputs?.pork)} kg, Frango=${fmt(foodInputs?.chicken)} kg, Laticínios=${fmt(foodInputs?.dairy)}, Vegetais=${fmt(foodInputs?.veg)} kg. Resultado=${food !== null ? food.toFixed(2) + " kg CO₂e" : "-"}`,
  );

  parts.push(
    `Resíduos: Resíduos=${fmt(wasteInputs?.wasteKg)} kg, % Reciclado=${fmt(wasteInputs?.recyclingPercent)}%. Resultado=${waste !== null ? waste.toFixed(2) + " kg CO₂e" : "-"}`,
  );

  parts.push(`Total: ${total.toFixed(2)} kg CO₂e`);

  const mathContext = parts.join("\n");

  return (
    <ChatModal visible={visible} onClose={onClose} mathContext={mathContext} />
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  navHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navButtonsContainer: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "center",
  },
  navButtonsContainerMobile: {
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    justifyContent: "space-between",
  },
  navButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    position: "relative",
    overflow: "hidden",
  },
  navButtonMobile: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    flex: 1,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.tabActiveText,
    borderRadius: radius.md,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.tabActiveText,
    zIndex: 1,
  },
  navButtonTextMobile: {
    fontSize: 11,
    fontWeight: "600" as const,
    textAlign: "center",
  },
  navButtonTextActive: {
    fontWeight: "700" as const,
  },
  contentContainer: {
    flex: 1,
  },
  screenPadding: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  mobileUsageWrapper: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  pageHeader: {
    marginBottom: 20,
    gap: spacing.xs,
  },
  desktopCalculatorLayout: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.lg,
  },
  calculatorColumn: {
    flex: 1,
    minWidth: 0,
  },
  usageColumn: {
    width: 360,
    flexShrink: 0,
  },
  usageButton: {
    alignSelf: "stretch",
    backgroundColor: colors.primary,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  usageButtonText: {
    color: colors.tabActiveText,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  usageInfo: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  usageEyebrow: {
    ...typography.label,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  usageTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  usageText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  usageStep: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  usageStepTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  desktopContentContainer: {
    alignSelf: "center",
    maxWidth: 1180,
    width: "100%",
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    marginBottom: spacing.sm,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  headerSub: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  tabWrapper: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  cornerDot: {
    position: "absolute",
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 9999,
    bottom: spacing.lg,
    right: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 3,
    borderColor: "white",
  },
  hintBubble: {
    position: "absolute",

    right: spacing.lg + 70,
    bottom: spacing.lg + 10,

    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,

    borderWidth: 1,
    borderColor: colors.border,

    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,

    zIndex: 20,
  },
  hintText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  hintArrow: {
    position: "absolute",
    right: -4,
    top: "50%",
    marginTop: -6,

    width: 12,
    height: 12,

    backgroundColor: colors.primary,

    transform: [{ rotate: "45deg" }],
  },
});
