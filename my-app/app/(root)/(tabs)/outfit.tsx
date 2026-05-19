import React, { useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { createPaymentIntent, getPaymentStatus, resolveProvider } from "@/lib/payments";

export default function OutfitScreen() {
  const { userId } = useAuth();
  const [country, setCountry] = useState("IN");
  const [currency, setCurrency] = useState("INR");
  const [amount, setAmount] = useState("49900");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("Not started");

  const selectedProvider = useMemo(
    () => resolveProvider(country, currency),
    [country, currency],
  );

  const startPayment = async () => {
    if (!userId) {
      Alert.alert("Sign in required", "Please sign in before making a payment.");
      return;
    }

    const numericAmount = Number.parseInt(amount, 10);
    if (!Number.isInteger(numericAmount) || numericAmount <= 0) {
      Alert.alert("Invalid amount", "Amount must be a positive integer in smallest currency units.");
      return;
    }

    try {
      setIsProcessing(true);
      setStatusText("Creating payment intent...");

      const created = await createPaymentIntent({
        userId,
        amount: numericAmount,
        country,
        currency,
        orderType: "one_time",
        metadata: {
          source: "outfit-screen",
        },
      });

      setStatusText(`Created ${created.provider} payment. localOrderId=${created.localOrderId}`);

      const status = await getPaymentStatus(created.localOrderId);
      setStatusText(
        `Provider: ${status.provider} | Status: ${status.status} | Amount: ${status.amount} ${status.currency}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown payment error";
      setStatusText(`Failed: ${message}`);
      Alert.alert("Payment flow failed", message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#ECEDF9] px-5 pt-4">
      <View className="rounded-3xl p-5 shadow-sm">
        <Text className="text-2xl font-semibold text-[#171421]">AI Outfit Planner</Text>
        <Text className="mt-2 text-sm text-[#5F5A72]">Payment gateway integration sandbox</Text>
      </View>

      <View className="mt-4 rounded-2xl bg-white p-4">
        <Text className="mb-1 text-xs font-medium text-[#5F5A72]">Country (ISO-2)</Text>
        <TextInput
          value={country}
          onChangeText={setCountry}
          autoCapitalize="characters"
          className="rounded-xl border border-[#E5E7EB] px-3 py-2"
        />

        <Text className="mb-1 mt-3 text-xs font-medium text-[#5F5A72]">Currency (ISO-3)</Text>
        <TextInput
          value={currency}
          onChangeText={setCurrency}
          autoCapitalize="characters"
          className="rounded-xl border border-[#E5E7EB] px-3 py-2"
        />

        <Text className="mb-1 mt-3 text-xs font-medium text-[#5F5A72]">Amount (smallest unit)</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="number-pad"
          className="rounded-xl border border-[#E5E7EB] px-3 py-2"
        />

        <Text className="mt-3 text-sm text-[#171421]">Chosen provider: {selectedProvider}</Text>

        <Pressable
          disabled={isProcessing}
          onPress={startPayment}
          className="mt-4 items-center rounded-xl bg-[#2563EB] px-4 py-3"
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-semibold text-white">Start payment</Text>
          )}
        </Pressable>

        <Text className="mt-4 text-xs text-[#5F5A72]">{statusText}</Text>
      </View>
    </SafeAreaView>
  );
}
