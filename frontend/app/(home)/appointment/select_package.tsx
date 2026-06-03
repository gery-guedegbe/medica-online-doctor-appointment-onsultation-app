import { s, vs } from "@/utils/styling";
import { useRouter } from "expo-router";
import { DoctorPackage } from "@/types";
import { IMAGES } from "@/constants/images";
import AppButton from "@/components/ui/AppButton";
import React, { useEffect, useState } from "react";
import SelectItem from "@/components/ui/SelectItem";
import { useBookingStore } from "@/store/useBookingStore";
import { getDoctorPacages } from "@/services/packageService";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

export const PackageOption: DoctorPackage[] = [
  { id: "1", type: "video", duration_minutes: 30, price: 20 },
  { id: "2", type: "voice", duration_minutes: 50, price: 65 },
  { id: "3", type: "messaging", duration_minutes: 45, price: 30 },
];

export const TypeData: {
  [key in DoctorPackage["type"]]: { label: string; desc: string; icon: any };
} = {
  video: {
    label: "Video Call",
    desc: "Video call with doctor",
    icon: IMAGES.video_call_icon,
  },
  voice: {
    label: "Voice Call",
    desc: "Voice call with doctor",
    icon: IMAGES.call_icon,
  },
  messaging: {
    label: "Messaging",
    desc: "Chat messages with doctor",
    icon: IMAGES.chat_icon,
  },
};

const SelectPackageScreen = () => {
  const router = useRouter();

  const { doctorId, setPackage } = useBookingStore();

  const [packages, setPackages] = useState<DoctorPackage[]>([]);

  const [loadingPackages, setLoadingPackages] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState<DoctorPackage | null>(
    null,
  );

  useEffect(() => {
    if (!doctorId) return;

    setLoadingPackages(true);
    setSelectedPackage(null);

    getDoctorPacages(doctorId)
      .then(setPackages)
      .catch(() => setPackages([]))
      .finally(() => setLoadingPackages(false));
  }, [doctorId]);

  const canProceed = selectedPackage !== null;

  const handleNext = () => {
    if (!canProceed) return;

    setPackage(selectedPackage!);

    router.push("/(home)/appointment/patient_details");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          gap: vs(24),
          paddingTop: vs(24),
          paddingBottom: vs(12),
          paddingHorizontal: s(24),
        }}
        className="bg-white dark:bg-dark-1"
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: s(12),
          }}
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
            className="font-urbanist-bold text-greyscale-900 dark:text-white"
          >
            Select Package
          </Text>
        </View>

        {loadingPackages === true ? (
          <View
            style={{
              flex: 1,
              paddingVertical: vs(24),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color="#246BFD" />
          </View>
        ) : packages.length !== 0 ? (
          <View style={{ flex: 1, gap: vs(24) }}>
            <View style={{ gap: vs(24) }}>
              <Text
                style={{ fontSize: s(20) }}
                className="font-urbanist-bold text-greyscale-900 dark:text-white"
              >
                Duration
              </Text>

              <View
                style={{
                  gap: vs(12),
                  height: vs(56),
                  borderRadius: s(16),
                  paddingHorizontal: s(20),
                  backgroundColor: "#FAFAFA",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Image
                  source={IMAGES.time_circle_icon}
                  style={{ width: s(20), height: s(20) }}
                  resizeMode="contain"
                />

                <Text
                  style={{ fontSize: s(14), letterSpacing: s(0.2) }}
                  className="font-urbanist-semibold text-greyscale-900"
                >
                  {selectedPackage?.duration_minutes
                    ? `${selectedPackage.duration_minutes} minutes`
                    : ""}
                </Text>
              </View>
            </View>

            <View style={{ gap: vs(24) }}>
              <Text
                style={{ fontSize: s(20) }}
                className="font-urbanist-bold text-greyscale-900 dark:text-white"
              >
                Select Package
              </Text>

              <View
                style={{
                  gap: vs(24),
                }}
              >
                {packages.map((option) => (
                  <SelectItem
                    id={option.id}
                    key={option.id}
                    price={option.price}
                    desc={TypeData[option.type].desc}
                    icon={TypeData[option.type].icon}
                    duration={option.duration_minutes}
                    label={TypeData[option.type].label}
                    onPress={() => setSelectedPackage(option)}
                    isSelected={selectedPackage?.id === option.id}
                  />
                ))}
              </View>
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
                onPress={handleNext}
                disabled={!canProceed}
                className={canProceed ? "bg-primary-500" : "bg-greyscale-200"}
              />
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: vs(24),
            }}
          >
            <Image
              source={IMAGES.not_found_image}
              resizeMode="contain"
              style={{ width: s(260), height: vs(200) }}
            />

            <View style={{ gap: vs(10), width: "100%" }}>
              <Text
                style={{ fontSize: s(22) }}
                className="text-center font-urbanist-bold text-greyscale-900 dark:text-white"
              >
                No Packages Available
              </Text>

              <Text
                style={{
                  fontSize: s(15),
                  letterSpacing: s(0.2),
                  lineHeight: vs(24),
                }}
                className="text-center font-urbanist-regular text-greyscale-500"
              >
                This doctor hasn&apos;t configured any consultation packages
                yet. Please check back later or choose another practitioner.
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SelectPackageScreen;
