export function calculateFood(
  beefKg: number,
  porkKg: number,
  chickenKg: number,
  dairyKg: number,
  vegKg: number,
) {
  const beefEmission = beefKg * 27.0;
  const porkEmission = porkKg * 12.0;
  const chickenEmission = chickenKg * 6.9;
  const dairyEmission = dairyKg * 1.9;
  const vegEmission = vegKg * 2.0;

  return (
    beefEmission + porkEmission + chickenEmission + dairyEmission + vegEmission
  );
}
