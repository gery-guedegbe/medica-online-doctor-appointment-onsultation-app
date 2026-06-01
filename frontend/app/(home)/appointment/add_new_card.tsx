import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import { IMAGES } from "@/constants/images";
import { cardSchema, CardFormData } from "@/schemas/card.schema";
import { useBookingStore } from "@/store/useBookingStore";
import { useAuthStore } from "@/stores/auth.store";
import { s, vs } from "@/utils/styling";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Helpers de formatage automatique ─────────────────────────────────────────
// Transforment la saisie brute en format lisible en temps réel.

// "1234567812345678" → "1234 5678 1234 5678"
const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
};

// "0926" → "09/26"
const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
};

// ─── Screen ───────────────────────────────────────────────────────────────────

const AddNewCardScreen = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { width } = useWindowDimensions();
  const { setPayment } = useBookingStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: { cardNumber: "", expiryDate: "", cvv: "" },
  });

  const onAdd = (data: CardFormData) => {
    setPayment("credit_card", {
      cvv: data.cvv,
      cardName: user?.full_name ?? "",
      cardNumber: data.cardNumber,
      expiryDate: data.expiryDate,
    });
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            paddingTop: vs(24),
            paddingBottom: vs(120),
            paddingHorizontal: s(24),
            gap: vs(24),
          }}
          className="bg-white dark:bg-dark-1"
        >
          {/* ── En-tête ── */}
          <View className="flex flex-row items-center justify-between">
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: s(12) }}
            >
              <Pressable
                hitSlop={18}
                onPress={() => router.back()}
                style={{ width: s(28), height: s(28) }}
              >
                <Image
                  source={IMAGES.arrow_left_icon}
                  style={{ flex: 1 }}
                  resizeMode="contain"
                />
              </Pressable>

              <Text
                style={{ fontSize: s(24) }}
                className="font-urbanist-bold text-greyscale-900"
              >
                Add New Card
              </Text>
            </View>

            <Pressable hitSlop={18} style={{ width: s(28), height: s(28) }}>
              <Image
                source={IMAGES.scan_icon}
                style={{ flex: 1 }}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <View style={{ flex: 1, gap: vs(24) }}>
              {/* Visuel de la carte */}
              <Image
                resizeMode="contain"
                source={IMAGES.card_image}
                style={{ width, height: vs(300), alignSelf: "center" }}
              />

              {/* ── Card Name (lecture seule, vient du profil) ── */}
              <View style={{ gap: vs(8) }}>
                <Text
                  style={{ fontSize: s(18), letterSpacing: s(0.2) }}
                  className="font-urbanist-bold text-greyscale-900 dark:text-white"
                >
                  Card Name
                </Text>

                <View
                  style={{
                    height: vs(56),
                    borderRadius: s(16),
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingHorizontal: s(20),
                    backgroundColor: "#FAFAFA",
                  }}
                >
                  <Text
                    style={{ fontSize: s(14), letterSpacing: s(0.2) }}
                    className="font-urbanist-semibold text-greyscale-900"
                  >
                    {user?.full_name}
                  </Text>
                </View>
              </View>

              {/* ── Card Number ── */}
              <View style={{ gap: vs(8) }}>
                <Text
                  style={{ fontSize: s(18), letterSpacing: s(0.2) }}
                  className="font-urbanist-bold text-greyscale-900 dark:text-white"
                >
                  Card Number
                </Text>

                <Controller
                  control={control}
                  name="cardNumber"
                  render={({ field: { value, onChange } }) => (
                    <AppInput
                      value={value}
                      placeholder="1234 5678 1234 5678"
                      keyboardType="numeric"
                      error={errors.cardNumber?.message}
                      onChangeText={(text) => onChange(formatCardNumber(text))}
                    />
                  )}
                />
              </View>

              {/* ── Expire Date + CVV ── */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: s(16),
                }}
              >
                {/* Expire Date */}
                <Controller
                  control={control}
                  name="expiryDate"
                  render={({ field: { value, onChange } }) => (
                    <View style={{ flex: 1, gap: vs(8) }}>
                      <Text
                        style={{ fontSize: s(18), letterSpacing: s(0.2) }}
                        className="font-urbanist-bold text-greyscale-900"
                      >
                        Expire Date
                      </Text>

                      <View
                        style={{
                          height: vs(56),
                          borderRadius: s(16),
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: s(16),
                          backgroundColor: "#FAFAFA",
                          gap: s(8),
                        }}
                      >
                        <TextInput
                          value={value}
                          placeholder="09/26"
                          keyboardType="numeric"
                          placeholderTextColor="#9E9E9E"
                          onChangeText={(text) => onChange(formatExpiry(text))}
                          style={{
                            flex: 1,
                            fontSize: s(14),
                            letterSpacing: s(0.2),
                            fontFamily: "Urbanist-SemiBold",
                            color: "#212121",
                          }}
                        />
                        <Image
                          resizeMode="contain"
                          source={IMAGES.calendar_black_icon}
                          style={{ width: s(20), height: s(20) }}
                        />
                      </View>

                      {errors.expiryDate && (
                        <Text
                          style={{ fontSize: s(12), letterSpacing: s(0.2) }}
                          className="font-urbanist-regular text-status-error"
                        >
                          {errors.expiryDate.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                {/* CVV */}
                <Controller
                  control={control}
                  name="cvv"
                  render={({ field: { value, onChange } }) => (
                    <View style={{ flex: 1, gap: vs(8) }}>
                      <Text
                        style={{ fontSize: s(18), letterSpacing: s(0.2) }}
                        className="font-urbanist-bold text-greyscale-900"
                      >
                        CVV
                      </Text>

                      <View
                        style={{
                          height: vs(56),
                          borderRadius: s(16),
                          alignItems: "center",
                          justifyContent: "center",
                          paddingHorizontal: s(16),
                          backgroundColor: "#FAFAFA",
                        }}
                      >
                        <TextInput
                          value={value}
                          placeholder="•••"
                          keyboardType="numeric"
                          secureTextEntry
                          maxLength={4}
                          placeholderTextColor="#9E9E9E"
                          onChangeText={(text) =>
                            onChange(text.replace(/\D/g, "").slice(0, 4))
                          }
                          style={{
                            width: "100%",
                            fontSize: s(14),
                            letterSpacing: s(0.2),
                            fontFamily: "Urbanist-SemiBold",
                            color: "#212121",
                          }}
                        />
                      </View>

                      {errors.cvv && (
                        <Text
                          style={{ fontSize: s(12), letterSpacing: s(0.2) }}
                          className="font-urbanist-regular text-status-error"
                        >
                          {errors.cvv.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>
            </View>
          </ScrollView>

          {/* ── Bouton fixe ── */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingHorizontal: s(24),
              paddingVertical: vs(24),
              alignItems: "center",
            }}
            className="bg-white dark:bg-dark-1"
          >
            <AppButton
              title="Add"
              loading={isSubmitting}
              onPress={handleSubmit(onAdd)}
              className="bg-primary-500"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddNewCardScreen;
