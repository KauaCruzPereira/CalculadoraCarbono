import React, { useContext, useState } from "react";
import { View, Text } from "react-native";
import { InputField, Btn, SectionCard } from "../components";
import { CarbonContext } from "../contexts/CarbonContext";
import { calculateEnergy } from "../solvers";
import { typography } from "../theme";

export const EnergyScreen = () => {
  const { setEnergy } = useContext(CarbonContext);
  const [electricity, setElectricity] = useState("");
  const [gas, setGas] = useState("");
  const [last, setLast] = useState<number | null>(null);

  const onCalculate = () => {
    const e = parseFloat(electricity) || 0;
    const g = parseFloat(gas) || 0;
    const emission = calculateEnergy(e, g);
    setEnergy(emission);
    setLast(emission);
  };

  return (
    <View>
      <SectionCard label="Energia">
        <InputField
          label="Eletricidade (kWh / mês)"
          value={electricity}
          onChangeText={setElectricity}
          placeholder="Ex: 150"
        />

        <InputField
          label="Gás (kg / mês)"
          value={gas}
          onChangeText={setGas}
          placeholder="Ex: 30"
        />

        <Btn label="Calcular" onPress={onCalculate} />

        {last !== null && (
          <Text style={typography.monoLarge}>{last.toFixed(2)} kg CO₂e</Text>
        )}
      </SectionCard>
    </View>
  );
};
