import React, { useContext, useState } from "react";
import { Text, View } from "react-native";
import { SectionCard, TabBar } from "../components";
import { colors, radius, spacing, typography } from "../theme";
import { CarbonContext } from "../contexts/CarbonContext";
import { EnergyScreen } from "./EnergyScreen";
import { TransportScreen } from "./TransportScreen";
import { FoodScreen } from "./FoodScreen";
import { WasteScreen } from "./WasteScreen";

export const HomeScreen = () => {
  const context = useContext(CarbonContext);
  const [active, setActive] = useState<
    "energy" | "transport" | "food" | "waste"
  >("energy");

  return (
    <View>
      <View
        style={{
          marginBottom: 20,
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
        }}
      >
        <TabBar active={active} onChange={(id) => setActive(id)} />
      </View>

      {active === "energy" && <EnergyScreen />}
      {active === "transport" && <TransportScreen />}
      {active === "food" && <FoodScreen />}
      {active === "waste" && <WasteScreen />}

      <SectionCard label="Resumo">
        <Text>Total emitido:</Text>

        <Text style={typography.monoLarge}>
          {context.total.toFixed(2)} kg CO₂e
        </Text>
      </SectionCard>
    </View>
  );
};
