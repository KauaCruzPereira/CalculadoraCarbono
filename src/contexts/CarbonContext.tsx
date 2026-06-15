import { createContext, useState } from "react";

export const CarbonContext = createContext({} as any);

export function CarbonProvider({ children }: { children: React.ReactNode }) {
  const [energy, setEnergy] = useState<number | null>(null);
  const [transport, setTransport] = useState<number | null>(null);
  const [waste, setWaste] = useState<number | null>(null);
  const [food, setFood] = useState<number | null>(null);

  const [energyInputs, setEnergyInputs] = useState({
    electricity: "",
    gas: "",
  });
  const [transportInputs, setTransportInputs] = useState({
    gasoline: "",
    diesel: "",
    airplaneKm: "",
  });
  const [foodInputs, setFoodInputs] = useState({
    beef: "",
    pork: "",
    chicken: "",
    dairy: "",
    veg: "",
  });
  const [wasteInputs, setWasteInputs] = useState({
    wasteKg: "",
    recyclingPercent: "",
  });

  const total = (energy || 0) + (transport || 0) + (waste || 0) + (food || 0);

  const resetAll = () => {
    setEnergy(null);
    setTransport(null);
    setWaste(null);
    setFood(null);

    setEnergyInputs({ electricity: "", gas: "" });
    setTransportInputs({ gasoline: "", diesel: "", airplaneKm: "" });
    setFoodInputs({ beef: "", pork: "", chicken: "", dairy: "", veg: "" });
    setWasteInputs({ wasteKg: "", recyclingPercent: "" });
  };

  return (
    <CarbonContext.Provider
      value={{
        energy,
        transport,
        waste,
        food,
        total,
        setEnergy,
        setTransport,
        setWaste,
        setFood,

        energyInputs,
        setEnergyInputs,
        transportInputs,
        setTransportInputs,
        foodInputs,
        setFoodInputs,
        wasteInputs,
        setWasteInputs,

        resetAll,
      }}
    >
      {children}
    </CarbonContext.Provider>
  );
}
