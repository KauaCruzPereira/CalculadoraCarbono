import React, { useEffect, useState, useContext } from "react";
import {
  Animated,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing, typography } from "./src/theme";

import Sparkles from "./src/assets/svg/sparkles";
import { CarbonProvider, CarbonContext } from "./src/contexts/CarbonContext";
import ChatModal from "./src/screens/ChatModal";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LinearGradient } from "expo-linear-gradient";

type NavItem = "biblioteca" | "solverequacoes" | "calculadoracarbono";

const NAV_URLS: Record<NavItem, string> = {
  biblioteca: "https://biblioteca-do-estudante.vercel.app/",
  solverequacoes: "https://solver-equacoes.vercel.app/",
  calculadoracarbono: "https://calculadora-carbono-cedup.vercel.app/",
};

interface NavigationHeaderProps {
  activeNav: NavItem;
  onNavChange: (nav: NavItem) => void;
}

function NavigationHeader({ activeNav, onNavChange }: NavigationHeaderProps) {
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width,
  );

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const navItems: { id: NavItem; label: string }[] = [
    { id: "biblioteca", label: "Biblioteca" },
    { id: "solverequacoes", label: "SolverEquações" },
    { id: "calculadoracarbono", label: "CalculadoraCarbono" },
  ];

  const animValues = React.useRef({
    biblioteca: new Animated.Value(0),
    solverequacoes: new Animated.Value(0),
    calculadoracarbono: new Animated.Value(1),
  }).current;

  React.useEffect(() => {
    navItems.forEach(({ id }) => {
      const isActive = activeNav === id;
      Animated.timing(animValues[id], {
        toValue: isActive ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  }, [activeNav]);

  const isMobile = windowWidth < 768;

  return (
    <View style={styles.navHeader}>
      <View
        style={[
          styles.navButtonsContainer,
          isMobile && styles.navButtonsContainerMobile,
        ]}
      >
        {navItems.map(({ id, label }) => {
          const scale = animValues[id].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.05],
          });

          const bgOpacity = animValues[id].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.15],
          });

          const displayLabel = isMobile
            ? label.split(/(?=[A-Z])/).join("\n")
            : label;

          return (
            <Animated.View
              key={id}
              style={[
                {
                  transform: [{ scale }],
                  opacity: 1,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  onNavChange(id);
                  if (Platform.OS === "web") {
                    window.location.href = NAV_URLS[id];
                  } else {
                    Linking.openURL(NAV_URLS[id]).catch((err) =>
                      console.error("Failed to open URL:", err),
                    );
                  }
                }}
                style={[styles.navButton, isMobile && styles.navButtonMobile]}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.navButtonBg,
                    {
                      opacity: bgOpacity,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.navButtonText,
                    isMobile && styles.navButtonTextMobile,
                    activeNav === id && styles.navButtonTextActive,
                  ]}
                  numberOfLines={isMobile ? 2 : 1}
                  adjustsFontSizeToFit
                >
                  {displayLabel}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  const [chatVisible, setChatVisible] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [activeNav, setActiveNav] = useState<NavItem>("calculadoracarbono");
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
      <NavigationHeader activeNav={activeNav} onNavChange={setActiveNav} />
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
                windowWidth >= 1024 && styles.desktopContentContainer,
                { paddingHorizontal: 12, paddingVertical: 12 },
              ]}
            >
              <View style={{ marginBottom: 20, gap: 4 }}>
                <Text style={typography.heading}>Calculadora de Carbono</Text>
                <Text style={{ fontSize: 15, color: colors.textSecondary }}>
                  Descubra sua pegada de carbono mensal.
                </Text>
              </View>

              <HomeScreen />
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
  desktopContentContainer: {
    alignSelf: "center",
    maxWidth: 800,
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
