import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { s, vs } from "@/utils/styling";
import { useRouter } from "expo-router";
import { IMAGES } from "@/constants/images";
import AppButton from "@/components/ui/AppButton";
import { useBookingStore } from "@/store/useBookingStore";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectPaiementOption from "@/components/ui/SelectPaiementOption";

interface PaiementOptionsProps {
  id: string;
  label: string;
  method: "paypal" | "google_pay" | "apple_pay";
  icon: ImageSourcePropType;
}

const PaiementOptions: PaiementOptionsProps[] = [
  { id: "1", label: "Paypal", method: "paypal", icon: IMAGES.paypal_logo },
  {
    id: "2",
    label: "Google Pay",
    method: "google_pay",
    icon: IMAGES.google_logo,
  },
  { id: "3", label: "Apple Pay", method: "apple_pay", icon: IMAGES.apple_logo },
];

const PaymentsScreen = () => {
  const router = useRouter();

  const { card, setPayment } = useBookingStore();

  const [selectedPaiementOption, setSelectedPaiementOption] =
    useState<PaiementOptionsProps | null>(null);

  const canProceed = selectedPaiementOption !== null;

  const handleNext = () => {
    if (!canProceed) return;

    setPayment(selectedPaiementOption.method);

    router.push("/(home)/appointment/review_summary");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingTop: vs(24),
          paddingBottom: vs(12),
          paddingHorizontal: s(24),
          gap: vs(24),
        }}
        className="bg-white dark:bg-dark-1"
      >
        {/* En-tête */}
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
              Payments
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

        <Text
          style={{ fontSize: s(16), letterSpacing: s(0.2) }}
          className="font-urbanist-medium text-greyscale-900"
        >
          Select the payment method you want to use.
        </Text>

        <View style={{ gap: vs(24) }}>
          {PaiementOptions.map((option) => (
            <SelectPaiementOption
              id={option.id}
              key={option.id}
              icon={option.icon}
              label={option.label}
              onPress={() => setSelectedPaiementOption(option)}
              isSelected={selectedPaiementOption?.id === option.id}
            />
          ))}

          {card && (
            <SelectPaiementOption
              id="4"
              icon={IMAGES.master_card_logo}
              label="•••• •••• •••• •••• 4679"
              onPress={() =>
                setSelectedPaiementOption({
                  id: "4",
                  label: "... .... .... 4679",
                  icon: IMAGES.master_card_logo,
                  method: "apple_pay",
                })
              }
              isSelected={selectedPaiementOption?.id === "4"}
            />
          )}

          <Pressable
            hitSlop={16}
            accessible={true}
            accessibilityRole="button"
            onPress={() => router.push("/(home)/appointment/add_new_card")}
            style={{
              gap: s(10),
              width: s(380),
              height: vs(58),
              borderRadius: s(50),
              paddingVertical: vs(18),
              paddingHorizontal: s(16),
              alignItems: "center",
              justifyContent: "center",
            }}
            className="bg-primary-100 shadow-none"
          >
            <Text
              style={{ fontSize: s(16), letterSpacing: s(0.2) }}
              className="text-center font-urbanist-bold text-primary-500"
            >
              Add New Card
            </Text>
          </Pressable>
        </View>

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
            title="Next"
            disabled={!canProceed}
            onPress={handleNext}
            className={canProceed ? "bg-primary-500" : "bg-greyscale-200"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentsScreen;
