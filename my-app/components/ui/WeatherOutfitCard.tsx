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
  comfortScore: number;
  bestFabric: string;
  bestColors: string;
}

interface WeatherOutfitCardProps {
  data?: WeatherData;
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_DATA: WeatherData = {
  city: "Indore",
  state: "MP",
  isLive: true,
  temperatureCelsius: 32,
  condition: "Sunny & Clear",
  humidityPercent: 40,
  windKmh: 12,
  uvLevel: "High",
  comfortScore: 68,
  bestFabric: "Linen · Cotton",
  bestColors: "Light & White",
};

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
      {/* Light lavender track */}
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke="#E5E8F5"
        strokeWidth={stroke}
        fill="transparent"
      />
      {/* Dark animated progress arc */}
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

// ─── Main Component ───────────────────────────────────────────────────────────

export const WeatherOutfitCard = React.memo(function WeatherOutfitCard({
  data = DEFAULT_DATA,
}: WeatherOutfitCardProps) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 12000, // 12 seconds for a slow, smooth rotation
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    rotateAnimation.start();
    return () => rotateAnimation.stop();
  }, [spinAnim]);

  useEffect(() => {
    const blinkAnimation = Animated.loop(
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
    blinkAnimation.start();
    return () => blinkAnimation.stop();
  }, [blinkAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.outerWrapper}>
      <View style={styles.rowContainer}>
        {/* ── Left: Weather condition icon card */}
        <View style={styles.iconCard}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <IconSun size={54} color="#F5A623" strokeWidth={1.5} />
          </Animated.View>
        </View>

        {/* ── Right: Info card */}
        <View style={styles.card}>
          {/* Row 1: Location pill + Comfort ring */}
          <View style={styles.topRow}>
            <View style={styles.locationPill}>
              <IconMapPin size={11} color="#1C1C1E" strokeWidth={2} />
              <Text style={styles.locationText}>
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

          {/* Row 2: Temperature (no °C, just °) */}
          <Text style={styles.tempText}>{data.temperatureCelsius}°</Text>

          {/* Row 3: Condition */}
          {/* <Text style={styles.conditionText}>{data.condition}</Text> */}

          {/* Row 4: Humidity + Wind chips only */}
          <View style={styles.chipsRow}>
            <WeatherChip
              icon={<IconDroplet size={13} color="#2A78FF" strokeWidth={2} />}
              label={`Humidity ${data.humidityPercent}%`}
            />
            <WeatherChip
              icon={<IconWind size={13} color="#7C6AFA" strokeWidth={2} />}
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
  outerWrapper: {
    marginTop: 10,
  },

  // Side-by-side layout
  rowContainer: {
    flexDirection: "row",
    gap: 6,
  },

  // Left: Sun icon card (stretches to match right card height)
  iconCard: {
    width: 125,
    // height: 120,
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7F0",
    borderWidth: 1,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  // Right: Weather info card
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

  // Location row
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
  },
  locationText: {
    fontSize: 12,
    fontFamily: "TikTokSans16pt-SemiBold",
    color: "#1C1C1E",
    letterSpacing: 0.2,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#FF000F", // ← red
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
  ringTextBox: {
    alignItems: "center",
    justifyContent: "center",
  },
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

  // Condition text
  // conditionText: {
  //   fontSize: 14,
  //   fontWeight: "100",
  //   color: "#1C1C1E",
  //   marginTop: 7,
  //   marginBottom: 10,
  // },

  // Chips with visible background + border
  chipsRow: {
    flexDirection: "row",
    // gap: 4,
    flexWrap: "wrap",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    // backgroundColor: "#F0F2FA",
    // borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 6,
    // marginTop: 3,
    // borderWidth: 1,
    // borderColor: "#E5E7F0",
  },
  chipText: {
    fontSize: 12,
    fontFamily: "TikTokSans16pt-SemiBold",
    color: "#1C1C1E",
  },
});
