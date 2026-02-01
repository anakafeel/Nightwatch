export type GeocodeResult = {
  name: string;
  lat: number;
  lng: number;
};

const OTTAWA_CENTER = { lat: 45.4215, lng: -75.6972 };

export async function geocodeOttawa(query: string): Promise<GeocodeResult> {
  const q = query.trim();
  if (!q) throw new Error("Empty location");

  // Photon API (usually CORS-friendly)
  const url =
    `https://photon.komoot.io/api/?` +
    new URLSearchParams({
      q,
      lat: String(OTTAWA_CENTER.lat),
      lon: String(OTTAWA_CENTER.lng),
      limit: "1",
    }).toString();

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoder failed: ${res.status}`);

  const data = await res.json();

  const f = data?.features?.[0];
  const coords = f?.geometry?.coordinates; // [lng, lat]
  if (!coords || coords.length < 2)
    throw new Error("No results for that place");

  const [lng, lat] = coords;

  const name =
    f?.properties?.name || f?.properties?.label || f?.properties?.street || q;

  return { name, lat, lng };
}
