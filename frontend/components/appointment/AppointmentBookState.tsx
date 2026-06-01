import { s, vs } from "@/utils/styling";
import React from "react";
import { IMAGES } from "@/constants/images";
import { useBookingStore } from "@/store/useBookingStore";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface AppointmentBookStateProps {
  visible: boolean;
  onClose: () => void;
  onViewAppointment: () => void;
  onTryAgain: () => void;
}

const AppointmentBookState = ({
  visible,
  onClose,
  onViewAppointment,
  onTryAgain,
}: AppointmentBookStateProps) => {
  const { error } = useBookingStore();

  // Succès si le store n'a pas d'erreur après la soumission
  const appointmentBooked = error === null;

  if (!visible) return null;

  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      {/* Tap sur l'overlay = fermer */}
      <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />

      <View
        style={{
          width: s(340),
          gap: vs(32),
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: vs(40),
          borderRadius: s(48),
          paddingBottom: vs(32),
          paddingHorizontal: s(32),
          backgroundColor: "#FFFFFF",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Image
          source={
            appointmentBooked ? IMAGES.congrate_image : IMAGES.failed_image
          }
          resizeMode="contain"
          style={{ width: s(185), height: vs(180) }}
        />

        <View
          style={{
            gap: vs(16),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ fontSize: s(24) }}
            className={`font-urbanist-bold ${
              appointmentBooked ? "text-primary-500" : "text-status-error"
            }`}
          >
            {appointmentBooked ? "Congratulations!" : "Oops, Failed!"}
          </Text>

          <Text
            style={{ fontSize: s(16), letterSpacing: 0.2 }}
            className="text-center font-urbanist-regular text-greyscale-900"
          >
            {appointmentBooked
              ? "Appointment successfully booked. You will receive a notification and the doctor you selected will contact you."
              : error ?? "Appointment failed. Please check your internet connection then try again."}
          </Text>
        </View>

        <View style={{ width: "100%", gap: vs(12) }}>
          <Pressable
            hitSlop={16}
            onPress={appointmentBooked ? onViewAppointment : onTryAgain}
            style={{
              width: "100%",
              height: vs(58),
              borderRadius: s(50),
              paddingHorizontal: s(16),
              paddingVertical: vs(18),
              alignItems: "center",
              justifyContent: "center",
            }}
            className="bg-primary-500 shadow-md"
          >
            <Text
              style={{ fontSize: s(16), letterSpacing: s(0.2) }}
              className="text-center font-urbanist-bold text-white"
            >
              {appointmentBooked ? "View Appointment" : "Try Again"}
            </Text>
          </Pressable>

          <Pressable
            hitSlop={16}
            onPress={onClose}
            style={{
              width: "100%",
              height: vs(58),
              borderRadius: s(50),
              paddingHorizontal: s(16),
              paddingVertical: vs(18),
              alignItems: "center",
              justifyContent: "center",
            }}
            className="bg-primary-100"
          >
            <Text
              style={{ fontSize: s(16), letterSpacing: s(0.2) }}
              className="text-center font-urbanist-bold text-primary-500"
            >
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AppointmentBookState;
