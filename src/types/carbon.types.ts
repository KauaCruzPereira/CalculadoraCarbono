export interface CarbonResult {
  category: string;
  emission: number;
}

export interface CarbonState {
  energy: number;
  transport: number;
  waste: number;
  food: number;
}
