import React, { useState } from "react";
import { useRouter } from "expo-router";
import { s, vs } from "@/utils/styling";
import { IMAGES } from "@/constants/images";
import { useDoctorStore } from "@/store/useDoctorStore";
import { useBookingStore } from "@/store/useBookingStore";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReviewSummaryCard from "@/components/ui/ReviewSummaryCard";
import AppButton from "@/components/ui/AppButton";
import AppointmentBookState from "@/components/appointment/AppointmentBookState";

interface ReviewItemProps {
  label: string | undefined;
  text: string | undefined;
}

const ReviewItem = ({ label, text }: ReviewItemProps) => (
  <View
    style={{
      gap: s(12),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Text
      style={{ fontSize: s(14), letterSpacing: s(0.2) }}
      className="text-start font-urbanist-medium text-greyscale-700"
    >
      {label}
    </Text>

    <Text
      numberOfLines={1}
      style={{ fontSize: s(16), letterSpacing: s(0.2) }}
      className="text-end font-urbanist-semibold text-greyscale-800"
    >
      {text}
    </Text>
  </View>
);

const ReviewSummaryScreen = () => {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);

  const {
    doctorId,
    date,
    package: packageInfos,
    isSubmitting,
    submitBooking,
    reset,
  } = useBookingStore();

  const doctor = useDoctorStore((state) =>
    state.doctors.find((d) => d.id === doctorId),
  );

  const formatType = (type: "messaging" | "video" | "voice" | undefined) => {
    switch (type) {
      case "messaging":
        return "Messaging";

      case "video":
        return "Video";

      case "voice":
        return "Voice";

      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          gap: vs(24),
          paddingTop: vs(24),
          paddingBottom: vs(48),
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
            Review Summary
          </Text>
        </View>

        <ReviewSummaryCard doctor={doctor} />

        <View
          style={{
            gap: vs(20),
            padding: s(24),
            borderRadius: s(20),
            boxShadow: "0 4px 60px 0 rgba(4, 6, 15, 0.05)",
          }}
        >
          <ReviewItem label="Date & Hour" text={date?.toString()} />

          <ReviewItem label="Package" text={formatType(packageInfos?.type)} />

          <ReviewItem
            label="Duration"
            text={`${packageInfos?.duration_minutes.toString()} minutes`}
          />
        </View>

        <View
          style={{
            gap: vs(20),
            padding: s(24),
            borderRadius: s(20),
            boxShadow: "0 4px 60px 0 rgba(4, 6, 15, 0.05)",
          }}
        >
          <ReviewItem
            label="Amount"
            text={`$${packageInfos?.price.toString()}`}
          />

          <ReviewItem
            label={`Duration (${packageInfos?.duration_minutes.toString()} mins)`}
            text={`1 x $${packageInfos?.price.toString()}`}
          />

          <View
            style={{ width: "100%", height: vs(1), backgroundColor: "#EEEEEE" }}
          />

          <ReviewItem
            label="Total"
            text={`$${packageInfos?.price.toString()}`}
          />
        </View>

        <View
          style={{
            gap: vs(20),
            padding: s(24),
            borderRadius: s(20),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 60px 0 rgba(4, 6, 15, 0.05)",
          }}
        >
          <View
            style={{ gap: vs(16), flexDirection: "row", alignItems: "center" }}
          >
            <Image
              source={IMAGES.master_card_logo}
              resizeMode="contain"
              style={{ width: s(42), height: s(32) }}
            />

            <Text
              style={{ fontSize: s(18) }}
              className="font-urbanist-bold text-greyscale-900"
            >
              •••• •••• •••• •••• 4679
            </Text>
          </View>

          <Pressable hitSlop={18}>
            <Text
              style={{ fontSize: s(16), letterSpacing: 0.2 }}
              className="font-urbanist-bold text-primary-500"
            >
              Change
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
            title="Book Appointment"
            loading={isSubmitting}
            className="bg-primary-500"
            onPress={async () => {
              await submitBooking();
              setModalVisible(true);
            }}
          />
        </View>

        {/* Modal succès / échec — rendu par-dessus le contenu grâce à zIndex */}
        <AppointmentBookState
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onViewAppointment={() => {
            reset();
            setModalVisible(false);
            router.replace("/(tabs)/appointments");
          }}
          onTryAgain={() => {
            setModalVisible(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ReviewSummaryScreen;
