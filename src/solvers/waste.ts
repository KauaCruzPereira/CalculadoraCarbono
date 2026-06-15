export function calculateWaste(wasteKg: number, recyclingPercent: number) {
  const factor = 2.0; // kg CO2e per kg of mixed waste (approximate)
  const effective =
    wasteKg * factor * (1 - Math.min(100, Math.max(0, recyclingPercent)) / 100);
  return effective;
}
