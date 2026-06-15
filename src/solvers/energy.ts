export function calculateEnergy(electricityKwh: number, gasKg: number) {
  const electricityEmission = electricityKwh * 0.084;

  const gasEmission = gasKg * 2.98;

  return electricityEmission + gasEmission;
}
