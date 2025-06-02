export function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Radius of the Earth in kilometers
  const R = 6371;

  // Convert degrees to radians
  const toRadians = (degree: number): number => {
    return degree * (Math.PI / 180);
  };

  // Difference in coordinates
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  // Convert latitude to radians
  const rLat1 = toRadians(lat1);
  const rLat2 = toRadians(lat2);

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  return R * c;
}


