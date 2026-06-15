export type SolverResult = {
  ok: boolean;
  title: string;
  value: string;
  steps: string[];
};

export { calculateEnergy } from "./energy";
export { calculateTransport } from "./transport";
export { calculateFood } from "./food";
export { calculateWaste } from "./waste";
