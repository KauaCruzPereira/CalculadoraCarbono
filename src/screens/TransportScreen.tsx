import React, { useContext, useState } from "react";
import { View, Text } from "react-native";
import { InputField, Btn, SectionCard } from "../components";
import { CarbonContext } from "../contexts/CarbonContext";
import { calculateTransport } from "../solvers";
import { typography } from "../theme";

export const TransportScreen = () => {
  const { setTransport } = useContext(CarbonContext);
  const [gasoline, setGasoline] = useState("");
  const [diesel, setDiesel] = useState("");
  const [airKm, setAirKm] = useState("");
  const [last, setLast] = useState<number | null>(null);

  const onCalculate = () => {
    const g = parseFloat(gasoline) || 0;
    const d = parseFloat(diesel) || 0;
    const a = parseFloat(airKm) || 0;
    const emission = calculateTransport(g, d, a);
    setTransport(emission);
    setLast(emission);
  };

  return (
    <View>
      <SectionCard label="Transporte">
        <InputField
          label="Gasolina (litros / mês)"
          value={gasoline}
          onChangeText={setGasoline}
          placeholder="Ex: 40"
        />

        <InputField
          label="Diesel (litros / mês)"
          value={diesel}
          onChangeText={setDiesel}
          placeholder="Ex: 0"
        />

        <InputField
          label="Avião (km / ano)"
          value={airKm}
          onChangeText={setAirKm}
          placeholder="Ex: 1200"
        />

        <Btn label="Calcular" onPress={onCalculate} />

        {last !== null && (
          <Text style={typography.monoLarge}>{last.toFixed(2)} kg CO₂e</Text>
        )}
      </SectionCard>
    </View>
  );
};
