export function calculateTransport(
  gasolineLiters: number,
  dieselLiters: number,
  airplaneKm: number,
) {
  return gasolineLiters * 2.31 + dieselLiters * 2.68 + airplaneKm * 0.255;
}
