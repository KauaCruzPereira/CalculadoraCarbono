import { createContext, useState } from "react";

export const CarbonContext = createContext({} as any);

export function CarbonProvider({ children }: { children: React.ReactNode }) {
  const [energy, setEnergy] = useState(0);
  const [transport, setTransport] = useState(0);
  const [waste, setWaste] = useState(0);
  const [food, setFood] = useState(0);

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

  const total = energy + transport + waste + food;

  const resetAll = () => {
    setEnergy(0);
    setTransport(0);
    setWaste(0);
    setFood(0);

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
