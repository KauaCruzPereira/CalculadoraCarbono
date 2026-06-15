import { createContext, useState } from "react";

export const CarbonContext = createContext({} as any);

export function CarbonProvider({ children }: { children: React.ReactNode }) {
  const [energy, setEnergy] = useState(0);
  const [transport, setTransport] = useState(0);
  const [waste, setWaste] = useState(0);
  const [food, setFood] = useState(0);

  const total = energy + transport + waste + food;

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
      }}
    >
      {children}
    </CarbonContext.Provider>
  );
}
