import React, { useContext, useState } from "react";
import { View, Text } from "react-native";
import { InputField, Btn, SectionCard } from "../components";
import { CarbonContext } from "../contexts/CarbonContext";
import { calculateFood } from "../solvers";
import { typography } from "../theme";

export const FoodScreen = () => {
  const { setFood } = useContext(CarbonContext);
  const [beef, setBeef] = useState("");
  const [pork, setPork] = useState("");
  const [chicken, setChicken] = useState("");
  const [dairy, setDairy] = useState("");
  const [veg, setVeg] = useState("");
  const [last, setLast] = useState<number | null>(null);

  const onCalculate = () => {
    const b = parseFloat(beef) || 0;
    const p = parseFloat(pork) || 0;
    const c = parseFloat(chicken) || 0;
    const d = parseFloat(dairy) || 0;
    const v = parseFloat(veg) || 0;
    const emission = calculateFood(b, p, c, d, v);
    setFood(emission);
    setLast(emission);
  };

  return (
    <View>
      <SectionCard label="Alimentação">
        <InputField
          label="Carne bovina (kg/mês)"
          value={beef}
          onChangeText={setBeef}
          placeholder="Ex: 8"
        />
        <InputField
          label="Carne suína (kg/mês)"
          value={pork}
          onChangeText={setPork}
          placeholder="Ex: 4"
        />
        <InputField
          label="Frango (kg/mês)"
          value={chicken}
          onChangeText={setChicken}
          placeholder="Ex: 26"
        />
        <InputField
          label="Laticínios (kg ou L/mês)"
          value={dairy}
          onChangeText={setDairy}
          placeholder="Ex: 10"
        />
        <InputField
          label="Vegetais (kg/mês)"
          value={veg}
          onChangeText={setVeg}
          placeholder="Ex: 17"
        />

        <Btn label="Calcular" onPress={onCalculate} />

        {last !== null && (
          <Text style={typography.monoLarge}>{last.toFixed(2)} kg CO₂e</Text>
        )}
      </SectionCard>
    </View>
  );
};
