import React, { useContext } from "react";
import { View, Text } from "react-native";
import { InputField, Btn, SectionCard } from "../components";
import { CarbonContext } from "../contexts/CarbonContext";
import { calculateFood } from "../solvers";
import { typography, colors } from "../theme";

export const FoodScreen = () => {
  const { foodInputs, setFoodInputs, setFood, food } =
    useContext(CarbonContext);

  const onCalculate = () => {
    const b = parseFloat(foodInputs.beef) || 0;
    const p = parseFloat(foodInputs.pork) || 0;
    const c = parseFloat(foodInputs.chicken) || 0;
    const d = parseFloat(foodInputs.dairy) || 0;
    const v = parseFloat(foodInputs.veg) || 0;
    const emission = calculateFood(b, p, c, d, v);
    setFood(emission);
  };

  return (
    <View>
      <SectionCard label="Alimentação">
        <InputField
          label="Carne bovina (kg/mês)"
          value={foodInputs.beef}
          onChangeText={(v) => setFoodInputs({ ...foodInputs, beef: v })}
          placeholder="Ex: 8"
        />
        <InputField
          label="Carne suína (kg/mês)"
          value={foodInputs.pork}
          onChangeText={(v) => setFoodInputs({ ...foodInputs, pork: v })}
          placeholder="Ex: 4"
        />
        <InputField
          label="Frango (kg/mês)"
          value={foodInputs.chicken}
          onChangeText={(v) => setFoodInputs({ ...foodInputs, chicken: v })}
          placeholder="Ex: 26"
        />
        <InputField
          label="Laticínios (kg ou L/mês)"
          value={foodInputs.dairy}
          onChangeText={(v) => setFoodInputs({ ...foodInputs, dairy: v })}
          placeholder="Ex: 10"
        />
        <InputField
          label="Vegetais (kg/mês)"
          value={foodInputs.veg}
          onChangeText={(v) => setFoodInputs({ ...foodInputs, veg: v })}
          placeholder="Ex: 17"
        />

        <Btn label="Calcular" onPress={onCalculate} />

        {typeof food === "number" && (
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
            <Text style={typography.monoLarge}>{food.toFixed(2)} kg CO₂e</Text>
          </View>
        )}
      </SectionCard>
    </View>
  );
};
