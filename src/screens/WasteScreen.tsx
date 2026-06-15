import React, { useContext, useState } from "react";
import { View, Text } from "react-native";
import { InputField, Btn, SectionCard } from "../components";
import { CarbonContext } from "../contexts/CarbonContext";
import { calculateWaste } from "../solvers";
import { typography } from "../theme";

export const WasteScreen = () => {
  const { setWaste } = useContext(CarbonContext);
  const [wasteKg, setWasteKg] = useState("");
  const [recycle, setRecycle] = useState("");
  const [last, setLast] = useState<number | null>(null);

  const onCalculate = () => {
    const w = parseFloat(wasteKg) || 0;
    const r = parseFloat(recycle) || 0;
    const emission = calculateWaste(w, r);
    setWaste(emission);
    setLast(emission);
  };

  return (
    <View>
      <SectionCard label="Resíduos">
        <InputField
          label="Resíduos (kg/mês)"
          value={wasteKg}
          onChangeText={setWasteKg}
          placeholder="Ex: 12"
        />
        <InputField
          label="% Reciclado"
          value={recycle}
          onChangeText={setRecycle}
          placeholder="Ex: 20"
        />

        <Btn label="Calcular" onPress={onCalculate} />

        {last !== null && (
          <Text style={typography.monoLarge}>{last.toFixed(2)} kg CO₂e</Text>
        )}
      </SectionCard>
    </View>
  );
};
