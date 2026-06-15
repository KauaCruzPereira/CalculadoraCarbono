import React, { useContext } from "react";
import { View, Text } from "react-native";
import { InputField, Btn, SectionCard } from "../components";
import { CarbonContext } from "../contexts/CarbonContext";
import { calculateWaste } from "../solvers";
import { typography, colors } from "../theme";

export const WasteScreen = () => {
  const { wasteInputs, setWasteInputs, setWaste, waste } =
    useContext(CarbonContext);

  const onCalculate = () => {
    const w = parseFloat(wasteInputs.wasteKg) || 0;
    const r = parseFloat(wasteInputs.recyclingPercent) || 0;
    const emission = calculateWaste(w, r);
    setWaste(emission);
  };

  return (
    <View>
      <SectionCard label="Resíduos">
        <InputField
          label="Resíduos (kg/mês)"
          value={wasteInputs.wasteKg}
          onChangeText={(v) => setWasteInputs({ ...wasteInputs, wasteKg: v })}
          placeholder="Ex: 12"
        />
        <InputField
          label="% Reciclado"
          value={wasteInputs.recyclingPercent}
          onChangeText={(v) =>
            setWasteInputs({ ...wasteInputs, recyclingPercent: v })
          }
          placeholder="Ex: 20"
        />

        <Btn label="Calcular" onPress={onCalculate} />

        {typeof waste === "number" && (
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.successBorder,
              backgroundColor: colors.successBg,
              padding: 12,
              borderRadius: 12,
              marginTop: 12,
            }}
          >
            <Text
              style={{
                color: colors.successText,
                fontWeight: "700",
                marginBottom: 6,
              }}
            >
              SUCCESS!
            </Text>
            <Text style={typography.monoLarge}>{waste.toFixed(2)} kg CO₂e</Text>
          </View>
        )}
      </SectionCard>
    </View>
  );
};
