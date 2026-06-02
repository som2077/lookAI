import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import {
  IconDroplet,
  IconWind,
  IconSun,
  IconMapPin,
} from "@tabler/icons-react-native";

// ─── Types ───────────────────────────────────────────────────────────────────

interface WeatherData {
  city: string;
  state: string;
  isLive: boolean;
  temperatureCelsius: number;
  condition: string;
  humidityPercent: number;
  windKmh: number;
  uvLevel: "Low" | "Moderate" | "High" | "Very High";
  comfortScore: number; // 0–100
  bestFabric: string;
  bestColors: string;
}

interface WeatherOutfitCardProps {
  data?: WeatherData;
}

// ─── Mock / default data ─────────────────────────────────────────────────────

const DEFAULT_DATA: WeatherData = {
  city: "Indore",
  state: "MP",
  isLive: true,
  temperatureCelsius: 32,
  condition: "Sunny & Hot",
  humidityPercent: 42,
  windKmh: 12,
  uvLevel: "High",
  comfortScore: 68,
  bestFabric: "Linen · Cotton",
  bestColors: "Light & White",
};

// ─── Comfort Ring ─────────────────────────────────────────────────────────────

const RING_SIZE = 80;
const STROKE = 7;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ComfortRing({ score }: { score: number }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: score / 100,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [score]);

  // Animated strokeDashoffset
  const dashOffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  const center = RING_SIZE / 2;

  // Score color: green > 70, amber 40–70, red < 40
  const scoreColor =
    score >= 70 ? "#000000" : score >= 80 ? "#000000" : "#000000";

  return (
    <View style={styles.ringContainer}>
      {/* Track ring */}
      <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
        <Circle
          cx={center}
          cy={center}
          r={RADIUS}
          stroke="#FFFFFF"
          strokeWidth={STROKE}
          fill="transparent"
        />
      </Svg>

      {/* Animated progress arc via JS-driven approach */}
      <AnimatedArc
        progress={progress}
        center={center}
        circumference={CIRCUMFERENCE}
        radius={RADIUS}
        stroke={STROKE}
        color={scoreColor}
      />

      {/* Score text */}
      <View style={styles.ringTextBox}>
        <Text style={styles.ringScore}>{score}</Text>
        <Text style={styles.ringLabel}>Comfort</Text>
      </View>
    </View>
  );
}

// Animated SVG arc via Animated.View clipping approach
function AnimatedArc({
  progress,
  center,
  circumference,
  radius,
  stroke,
  color,
}: {
  progress: Animated.Value;
  center: number;
  circumference: number;
  radius: number;
  stroke: number;
  color: string;
}) {
  const [dashOffset, setDashOffset] = useState(circumference);

  useEffect(() => {
    const id = progress.addListener(({ value }) => {
      setDashOffset(circumference * (1 - value));
    });
    return () => progress.removeListener(id);
  }, []);

  return (
    <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        fill="transparent"
        transform={`rotate(-90 ${center} ${center})`}
      />
    </Svg>
  );
}

// ─── UV badge color ───────────────────────────────────────────────────────────

const UV_COLORS: Record<string, string> = {
  Low: "#22C55E",
  Moderate: "#F5B93A",
  High: "#F97316",
  "Very High": "#EF4444",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const WeatherOutfitCard = React.memo(function WeatherOutfitCard({
  data = DEFAULT_DATA,
}: WeatherOutfitCardProps) {
  const uvColor = UV_COLORS[data.uvLevel] ?? "#F97316";

  return (
    <View style={styles.outerWrapper}>
      {/* ── Gradient card ───────────────────────────────────────────── */}
      <View style={styles.card}>
        {/* Decorative blobs for premium feel */}
        <View style={styles.blob1} />

        {/* ── Row 1: Location + Comfort Ring */}
        <View style={styles.topRow}>
          {/* Location pill */}
          <View style={styles.locationPill}>
            <IconMapPin size={11} color="#1C1C1E" strokeWidth={2} />
            <Text style={styles.locationText}>
              {data.city}, {data.state}
            </Text>
            {data.isLive && (
              <>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Live</Text>
              </>
            )}
          </View>

          {/* Comfort ring */}
          <ComfortRing score={data.comfortScore} />
        </View>

        {/* ── Row 2: Temperature + Condition */}
        <View style={styles.tempRow}>
          <Text style={styles.tempText}>{data.temperatureCelsius}°</Text>
          <View style={styles.conditionRow}>
            <View style={styles.conditionDot} />
            <Text style={styles.conditionText}>{data.condition}</Text>
          </View>
        </View>

        {/* ── Row 3: Weather chips */}
        <View style={styles.chipsRow}>
          <WeatherChip
            icon={<IconDroplet size={13} color="#2A78FF" strokeWidth={2} />}
            label={`${data.humidityPercent}% Humidity`}
          />
          <WeatherChip
            icon={<IconWind size={13} color="#7C6AFA" strokeWidth={2} />}
            label={`${data.windKmh} km/h Wind`}
          />
          <WeatherChip
            icon={<IconSun size={13} color={uvColor} strokeWidth={2} />}
            label={`UV ${data.uvLevel}`}
          />
        </View>

        <View style={{ height: 16 }} />
      </View>
    </View>
  );
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function WeatherChip({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <View style={styles.chip}>
      {icon}
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

function GuideChip({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <View style={styles.guideChip}>
      {icon}
      <View style={styles.guideChipText}>
        <Text style={styles.guideChipLabel}>{label}</Text>
        <Text style={styles.guideChipValue}>{value}</Text>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  outerWrapper: {
    marginTop: 14,
    borderRadius: 24,
    // overflow: "hidden",
  },

  // ── Card
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E9EBF8",
    borderWidth: 1,
    paddingTop: 14,
    paddingHorizontal: 18,
    // paddingBottom: 1,
    marginBottom: 5,
    overflow: "hidden",
    borderRadius: 24,
  },

  blob1: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#E9EBF8",
    top: -40,
    right: -30,
  },

  // ── Top row
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E9EBF850",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  locationText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1C1C1E",
    letterSpacing: 0.2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
    marginLeft: 2,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1C1C1E",
  },

  // ── Ring
  ringContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ringTextBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringScore: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1C1C1E",
    lineHeight: 24,
  },
  ringLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "#1C1C1E",
    opacity: 0.7,
    letterSpacing: 0.3,
  },

  // ── Temp
  tempRow: {
    marginTop: -40,
  },
  tempText: {
    fontSize: 52,
    fontWeight: "900",
    color: "#1C1C1E",
    lineHeight: 50,
    letterSpacing: -2,
    marginLeft: 12,
  },
  conditionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: -2,
  },
  conditionDot: {
    width: 14,
    height: 14,
    marginTop: 10,
    marginLeft: 12,
    borderRadius: 7,
    backgroundColor: "#FFF176",
    shadowColor: "#F5B93A",
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 2,
  },
  conditionText: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: "700",
    color: "#1C1C1E",
  },

  // ── Chips
  chipsRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 10,
    marginLeft: 2,
    flexWrap: "wrap",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1C1C1E",
  },

  // ── Outfit guide
  outfitGuideLabel: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#1C1C1E",
    opacity: 0.55,
    letterSpacing: 1.2,
    marginTop: 16,
    marginBottom: 8,
  },
  guideRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 0,
    marginBottom: 16,
  },
  guideDivider: {
    width: 1,
    backgroundColor: "rgba(28,28,30,0.15)",
    marginHorizontal: 14,
  },
  guideChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  guideChipText: {
    gap: 1,
  },
  guideChipLabel: {
    fontSize: 9.5,
    fontWeight: "600",
    color: "#1C1C1E",
    opacity: 0.55,
    letterSpacing: 0.3,
  },
  guideChipValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1C1C1E",
  },

  // ── Black CTA banner
  ctaBanner: {
    backgroundColor: "#131313",
    paddingVertical: 17,
    paddingHorizontal: 18,
    position: "relative",
    overflow: "hidden",
  },
  ctaShimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  ctaContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ctaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.1,
  },
  ctaArrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
});
