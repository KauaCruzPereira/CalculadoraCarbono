import React, { useContext } from "react";
import { View, Text } from "react-native";
import { InputField, Btn, SectionCard } from "../components";
import { CarbonContext } from "../contexts/CarbonContext";
import { calculateTransport } from "../solvers";
import { typography, colors } from "../theme";

export const TransportScreen = () => {
  const { transportInputs, setTransportInputs, setTransport, transport } =
    useContext(CarbonContext);

  const onCalculate = () => {
    const g = parseFloat(transportInputs.gasoline) || 0;
    const d = parseFloat(transportInputs.diesel) || 0;
    const a = parseFloat(transportInputs.airplaneKm) || 0;
    const emission = calculateTransport(g, d, a);
    setTransport(emission);
  };

  return (
    <View>
      <SectionCard label="Transporte">
        <InputField
          label="Gasolina (litros / mês)"
          value={transportInputs.gasoline}
          onChangeText={(v) =>
            setTransportInputs({ ...transportInputs, gasoline: v })
          }
          placeholder="Ex: 40"
        />

        <InputField
          label="Diesel (litros / mês)"
          value={transportInputs.diesel}
          onChangeText={(v) =>
            setTransportInputs({ ...transportInputs, diesel: v })
          }
          placeholder="Ex: 0"
        />

        <InputField
          label="Avião (km / ano)"
          value={transportInputs.airplaneKm}
          onChangeText={(v) =>
            setTransportInputs({ ...transportInputs, airplaneKm: v })
          }
          placeholder="Ex: 1200"
        />

        <Btn label="Calcular" onPress={onCalculate} />

        {typeof transport === "number" && (
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
            <Text style={typography.monoLarge}>
              {transport.toFixed(2)} kg CO₂e
            </Text>
          </View>
        )}
      </SectionCard>
    </View>
  );
};
