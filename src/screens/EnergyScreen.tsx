import React, { useContext, useState } from "react";
import { View, Text } from "react-native";
import { InputField, Btn, SectionCard } from "../components";
import { CarbonContext } from "../contexts/CarbonContext";
import { calculateEnergy } from "../solvers";
import { typography, colors } from "../theme";

export const EnergyScreen = () => {
  const { energyInputs, setEnergyInputs, setEnergy, energy } =
    useContext(CarbonContext);

  const onCalculate = () => {
    const e = parseFloat(energyInputs.electricity) || 0;
    const g = parseFloat(energyInputs.gas) || 0;
    const emission = calculateEnergy(e, g);
    setEnergy(emission);
  };

  const [success, setSuccess] = useState(false);

  return (
    <View>
      <SectionCard label="Energia">
        <InputField
          label="Eletricidade (kWh / mês)"
          value={energyInputs.electricity}
          onChangeText={(v) =>
            setEnergyInputs({ ...energyInputs, electricity: v })
          }
          placeholder="Ex: 150"
        />

        <InputField
          label="Gás (kg / mês)"
          value={energyInputs.gas}
          onChangeText={(v) => setEnergyInputs({ ...energyInputs, gas: v })}
          placeholder="Ex: 30"
        />

        <Btn label="Calcular" onPress={onCalculate} />

        {typeof energy === "number" && (
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
                marginBottom: 6,
              }}
            >
              SUCCESSO!
            </Text>
            <Text style={typography.monoLarge}>
              {energy.toFixed(2)} kg CO₂e
            </Text>
          </View>
        )}
      </SectionCard>
    </View>
  );
};
