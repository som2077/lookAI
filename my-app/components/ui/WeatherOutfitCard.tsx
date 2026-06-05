import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Text,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import {
  IconDroplet,
  IconWind,
  IconSun,
  IconMoon,
  IconCloud,
  IconCloudRain,
  IconCloudSnow,
  IconCloudStorm,
  IconMapPin,
  IconRefresh,
  IconAlertCircle,
} from "@tabler/icons-react-native";
import { useWeatherStore } from "@/backend/store/weather-store";

// ─── Comfort Ring ─────────────────────────────────────────────────────────────

const RING_SIZE = 65;
const STROKE = 6;
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

  const center = RING_SIZE / 2;

  return (
    <View style={styles.ringContainer}>
      <AnimatedArc
        progress={progress}
        center={center}
        circumference={CIRCUMFERENCE}
        radius={RADIUS}
        stroke={STROKE}
      />
      <View style={styles.ringTextBox}>
        <Text style={styles.ringScore}>{score}</Text>
        <Text style={styles.ringLabel}>Comfort</Text>
      </View>
    </View>
  );
}

function AnimatedArc({
  progress,
  center,
  circumference,
  radius,
  stroke,
}: {
  progress: Animated.Value;
  center: number;
  circumference: number;
  radius: number;
  stroke: number;
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
        stroke="#E5E8F5"
        strokeWidth={stroke}
        fill="transparent"
      />
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke="#1C1C1E"
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

// ─── Weather Icon ─────────────────────────────────────────────────────────────

function WeatherIcon({
  iconCode,
  spinAnim,
}: {
  iconCode: string;
  spinAnim: Animated.Value;
}) {
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const isNight = iconCode.endsWith("n");
  const code = iconCode.slice(0, 2);

  // Map OWM icon codes to tabler icons
  if (code === "01") {
    // Clear
    return isNight ? (
      <IconMoon size={54} color="#7C8FAB" strokeWidth={1.5} />
    ) : (
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <IconSun size={54} color="#F5A623" strokeWidth={1.5} />
      </Animated.View>
    );
  }
  if (code === "02" || code === "03" || code === "04") {
    return <IconCloud size={54} color="#94A3B8" strokeWidth={1.5} />;
  }
  if (code === "09" || code === "10") {
    return <IconCloudRain size={54} color="#60A5FA" strokeWidth={1.5} />;
  }
  if (code === "11") {
    return <IconCloudStorm size={54} color="#818CF8" strokeWidth={1.5} />;
  }
  if (code === "13") {
    return <IconCloudSnow size={54} color="#BAE6FD" strokeWidth={1.5} />;
  }
  // Default — sunny
  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <IconSun size={54} color="#F5A623" strokeWidth={1.5} />
    </Animated.View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const WeatherOutfitCard = React.memo(function WeatherOutfitCard() {
  const { data, loading, error, fetchWeather } = useWeatherStore();

  const spinAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  // Spin animation for sun icon
  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [spinAnim]);

  // Blink animation for live dot
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [blinkAnim]);

  // Fetch on mount
  useEffect(() => {
    fetchWeather();
  }, []);

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading && !data) {
    return (
      <View style={styles.outerWrapper}>
        <View style={styles.rowContainer}>
          <View style={[styles.iconCard, styles.skeleton]} />
          <View style={[styles.card, styles.skeleton]} />
        </View>
      </View>
    );
  }

  // ── Error / permission denied ───────────────────────────────────────────────
  if ((error || !data) && !loading) {
    const isDenied = error === "location_denied";
    return (
      <View style={styles.outerWrapper}>
        <View style={[styles.errorCard]}>
          <IconAlertCircle size={20} color="#9CA3AF" strokeWidth={1.8} />
          <Text style={styles.errorText}>
            {isDenied
              ? "Location access denied. Enable it in Settings."
              : "Could not load weather. Check your API key."}
          </Text>
          <Pressable onPress={fetchWeather} style={styles.retryBtn}>
            <IconRefresh size={13} color="#6366F1" strokeWidth={2} />
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!data) return null;

  return (
    <View style={styles.outerWrapper}>
      <View style={styles.rowContainer}>
        {/* ── Left: Weather icon card */}
        <View style={styles.iconCard}>
          <WeatherIcon iconCode={data.weatherIcon} spinAnim={spinAnim} />
        </View>

        {/* ── Right: Info card */}
        <View style={styles.card}>
          {/* Row 1: Location pill + Comfort ring */}
          <View style={styles.topRow}>
            <View style={styles.locationPill}>
              <IconMapPin size={11} color="#1C1C1E" strokeWidth={2} />
              <Text style={styles.locationText} numberOfLines={1}>
                {data.city}, {data.state}
              </Text>
              {data.isLive && (
                <>
                  <Animated.View
                    style={[styles.liveDot, { opacity: blinkAnim }]}
                  />
                  <Text style={styles.liveText}>Live</Text>
                </>
              )}
            </View>
            <ComfortRing score={data.comfortScore} />
          </View>

          {/* Row 2: Temperature */}
          <Text style={styles.tempText}>{data.temperatureCelsius}°</Text>

          {/* Row 3: Humidity + Wind */}
          <View style={styles.chipsRow}>
            <WeatherChip
              icon={<IconDroplet size={12} color="#2A78FF" strokeWidth={2} />}
              label={`Humidity ${data.humidityPercent}%`}
            />
            <WeatherChip
              icon={<IconWind size={12} color="#7C6AFA" strokeWidth={2} />}
              label={`Wind ${data.windKmh}km/h`}
            />
          </View>
        </View>
      </View>
    </View>
  );
});

// ─── WeatherChip ──────────────────────────────────────────────────────────────

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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  outerWrapper: { marginTop: 10 },

  rowContainer: { flexDirection: "row", gap: 6 },

  iconCard: {
    width: 125,
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7F0",
    borderWidth: 1,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 130,
  },

  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7F0",
    borderWidth: 1,
    borderRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },

  // Skeleton
  skeleton: {
    backgroundColor: "#F3F4F6",
    borderColor: "#F3F4F6",
    minHeight: 130,
  },

  // Error
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FAFAFA",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 17,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  retryText: { fontSize: 11, color: "#6366F1", fontWeight: "700" },

  // Location
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingLeft: 2,
    flex: 1,
    paddingRight: 8,
  },
  locationText: {
    fontSize: 12,
    fontFamily: "TikTokSans16pt-SemiBold",
    color: "#1C1C1E",
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#FF000F",
    marginLeft: 2,
  },
  liveText: {
    fontSize: 11,
    fontFamily: "TikTokSans16pt-SemiBold",
    color: "#1C1C1E",
  },

  // Comfort ring
  ringContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ringTextBox: { alignItems: "center", justifyContent: "center" },
  ringScore: {
    fontSize: 15,
    fontFamily: "TikTokSans16pt-ExtraBold",
    color: "#1C1C1E",
    lineHeight: 24,
  },
  ringLabel: {
    fontSize: 7,
    fontFamily: "TikTokSans16pt-SemiBold",
    color: "#1C1C1E",
    opacity: 0.6,
    letterSpacing: 0.3,
  },

  // Temperature
  tempText: {
    fontSize: 43,
    fontFamily: "TikTokSans16pt-Black",
    color: "#1C1C1E",
    letterSpacing: -2,
    lineHeight: 54,
    marginTop: -45,
  },

  // Chips
  chipsRow: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    fontFamily: "TikTokSans16pt-SemiBold",
    color: "#1C1C1E",
  },
});
