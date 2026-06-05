import { create } from "zustand";
import * as Location from "expo-location";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WeatherData {
  city: string;
  state: string;
  isLive: boolean;
  temperatureCelsius: number;
  condition: string;
  humidityPercent: number;
  windKmh: number;
  uvLevel: "Low" | "Moderate" | "High" | "Very High";
  comfortScore: number;
  bestFabric: string;
  bestColors: string;
  weatherIcon: string; // OpenWeatherMap icon code e.g. "01d"
}

interface WeatherStore {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  fetchWeather: () => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ?? "";
const CACHE_MS = 10 * 60 * 1000; // 10 minutes

function uvIndexToLevel(uvi: number): WeatherData["uvLevel"] {
  if (uvi <= 2) return "Low";
  if (uvi <= 5) return "Moderate";
  if (uvi <= 7) return "High";
  return "Very High";
}

/** 0–100 comfort score based on temp, humidity & wind */
function calcComfortScore(
  temp: number,
  humidity: number,
  wind: number,
): number {
  // Ideal: 22°C, 50% humidity, 10 km/h wind
  const tempScore = Math.max(0, 100 - Math.abs(temp - 22) * 3);
  const humScore = Math.max(0, 100 - Math.abs(humidity - 50) * 1.2);
  const windScore = Math.max(0, 100 - Math.max(0, wind - 10) * 2);
  return Math.round(tempScore * 0.5 + humScore * 0.3 + windScore * 0.2);
}

function bestFabricForTemp(temp: number): string {
  if (temp >= 35) return "Linen · Mesh";
  if (temp >= 28) return "Cotton · Linen";
  if (temp >= 20) return "Cotton · Chino";
  if (temp >= 12) return "Denim · Wool";
  return "Wool · Fleece";
}

function bestColorsForTemp(temp: number): string {
  if (temp >= 30) return "White · Pastels";
  if (temp >= 20) return "Light & Earthy";
  if (temp >= 12) return "Neutral & Navy";
  return "Dark & Rich";
}

// ─── State Abbreviations ──────────────────────────────────────────────────────

const STATE_ABBR: Record<string, string> = {
  // ── India – States
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  Assam: "AS",
  Bihar: "BR",
  Chhattisgarh: "CG",
  Goa: "GA",
  Gujarat: "GJ",
  Haryana: "HR",
  "Himachal Pradesh": "HP",
  Jharkhand: "JH",
  Karnataka: "KA",
  Kerala: "KL",
  "Madhya Pradesh": "MP",
  Maharashtra: "MH",
  Manipur: "MN",
  Meghalaya: "ML",
  Mizoram: "MZ",
  Nagaland: "NL",
  Odisha: "OD",
  Punjab: "PB",
  Rajasthan: "RJ",
  Sikkim: "SK",
  "Tamil Nadu": "TN",
  Telangana: "TG",
  Tripura: "TR",
  "Uttar Pradesh": "UP",
  Uttarakhand: "UK",
  "West Bengal": "WB",
  // ── India – UTs
  "Andaman and Nicobar Islands": "AN",
  Chandigarh: "CH",
  "Dadra and Nagar Haveli and Daman and Diu": "DN",
  Delhi: "DL",
  "Jammu and Kashmir": "JK",
  Ladakh: "LA",
  Lakshadweep: "LD",
  Puducherry: "PY",
  // ── USA
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
  // ── UK
  England: "ENG",
  Scotland: "SCT",
  Wales: "WLS",
  "Northern Ireland": "NIR",
  // ── Canada
  Ontario: "ON",
  Quebec: "QC",
  "British Columbia": "BC",
  Alberta: "AB",
  Manitoba: "MB",
  Saskatchewan: "SK",
  "Nova Scotia": "NS",
  "New Brunswick": "NB",
  "Newfoundland and Labrador": "NL",
  // ── Australia
  "New South Wales": "NSW",
  Victoria: "VIC",
  Queensland: "QLD",
  "Western Australia": "WA",
  "South Australia": "SA",
  Tasmania: "TAS",
  // ── Countries (fallback)
  India: "IN",
  "United States": "US",
  "United Kingdom": "UK",
  Canada: "CA",
  Australia: "AU",
  Pakistan: "PK",
  Bangladesh: "BD",
  Nepal: "NP",
  "Sri Lanka": "LK",
  Germany: "DE",
  France: "FR",
  Italy: "IT",
  Spain: "ES",
  Japan: "JP",
  China: "CN",
  "South Korea": "KR",
  Singapore: "SG",
  UAE: "AE",
  "Saudi Arabia": "SA",
};

/** Returns 2–3 char abbreviation for any state/country name */
function abbreviateState(name: string): string {
  if (!name) return "";
  if (STATE_ABBR[name]) return STATE_ABBR[name];
  const lower = name.toLowerCase();
  const found = Object.keys(STATE_ABBR).find((k) => k.toLowerCase() === lower);
  if (found) return STATE_ABBR[found];
  // Fallback: initials of each word, max 3 chars
  return name
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3);
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  lastFetchedAt: null,

  fetchWeather: async () => {
    const { loading, lastFetchedAt } = get();
    if (loading) return;

    // Return cached data if fresh
    if (lastFetchedAt && Date.now() - lastFetchedAt < CACHE_MS && get().data)
      return;

    set({ loading: true, error: null });

    try {
      // 1. Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        set({ loading: false, error: "location_denied" });
        return;
      }

      // 2. Get current coordinates
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = loc.coords;

      // 3. Reverse geocode for city name
      const [place] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      const city =
        place?.city ?? place?.district ?? place?.subregion ?? "Unknown";
      const state = place?.region ?? place?.country ?? "";

      // 4. Fetch current weather from OpenWeatherMap
      const weatherUrl =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
      const weatherRes = await fetch(weatherUrl);
      const weatherJson = await weatherRes.json();

      if (!weatherRes.ok)
        throw new Error(weatherJson.message ?? "Weather fetch failed");

      const temp = Math.round(weatherJson.main.temp);
      const humidity = weatherJson.main.humidity;
      const windKmh = Math.round((weatherJson.wind?.speed ?? 0) * 3.6);
      const condition = weatherJson.weather?.[0]?.description ?? "Clear";
      const icon = weatherJson.weather?.[0]?.icon ?? "01d";

      // 5. Fetch UVI (One Call API 2.5 – free tier)
      let uvLevel: WeatherData["uvLevel"] = "Low";
      try {
        const uvUrl =
          `https://api.openweathermap.org/data/2.5/uvi` +
          `?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
        const uvRes = await fetch(uvUrl);
        const uvJson = await uvRes.json();
        uvLevel = uvIndexToLevel(uvJson.value ?? 0);
      } catch (_) {
        // UVI optional — don't fail the whole fetch
      }

      const comfortScore = calcComfortScore(temp, humidity, windKmh);

      set({
        data: {
          city,
          state: abbreviateState(state),
          isLive: true,
          temperatureCelsius: temp,
          condition: condition.charAt(0).toUpperCase() + condition.slice(1),
          humidityPercent: humidity,
          windKmh,
          uvLevel,
          comfortScore,
          bestFabric: bestFabricForTemp(temp),
          bestColors: bestColorsForTemp(temp),
          weatherIcon: icon,
        },
        loading: false,
        lastFetchedAt: Date.now(),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      set({ loading: false, error: msg });
    }
  },
}));
