import { IMAGES } from "@/constants/images";
import { Appointment, AppointmentStatus, Doctor, DoctorPackage } from "@/types";
import { s, vs } from "@/utils/styling";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface AppointmentCardProps {
  doctor: Doctor;
  appointment: Appointment[];
  onPress?: () => void;
  onCancel?: () => void;
  onReschedule?: () => void;
  onBookAgain?: () => void;
  onLeaveReview?: () => void;
  doctor_packages: DoctorPackage[];
  status: AppointmentStatus;
}

const TypeData: {
  [key in DoctorPackage["type"]]: { label: string; icon: any };
} = {
  video: {
    label: "Video Call",
    icon: IMAGES.video_call_icon,
  },
  voice: {
    label: "Voice Call",
    icon: IMAGES.call_icon,
  },
  messaging: {
    label: "Messaging",
    icon: IMAGES.chat_icon,
  },
};

const AppointmentCard = ({
  appointment,
  doctor,
  status,
  doctor_packages,
  onPress,
  onCancel,
  onReschedule,
  onBookAgain,
  onLeaveReview,
}: AppointmentCardProps) => {

  return (
    <View
      style={{
        gap: s(16),
        padding: s(16),
        borderRadius: s(24),
        boxShadow: "0 4px 60px 0 rgba(4, 6, 15, 0.05)",
      }}
      className="bg-white dark:bg-dark-2"
    >
      <View
        style={{
          gap: s(16),
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* Photo — seule zone de tap pour la navigation */}
        <Pressable
          onPress={onPress}
          disabled={!onPress}
          style={{ width: s(110), height: s(110) }}
        >
          <Image
            source={{ uri: doctor.avatar_url }}
            style={{ flex: 1, borderRadius: s(16) }}
            resizeMode="cover"
          />
        </Pressable>

        {/* Infos */}
        <View style={{ flex: 1, gap: vs(14) }}>
          <Text
            numberOfLines={1}
            style={{ flex: 1, fontSize: s(18) }}
            className="font-urbanist-bold text-greyscale-900 dark:text-white"
          >
            {doctor.full_name}
          </Text>

          <View
            style={{ flexDirection: "row", alignItems: "center", gap: s(6) }}
          >
            <Text
              numberOfLines={1}
              style={{ fontSize: s(12), letterSpacing: s(0.2) }}
              className="font-urbanist-medium text-greyscale-800"
            >
              {TypeData[doctor_packages[0].type].label}
            </Text>

            <View
              style={{
                gap: s(8),
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: s(6),
                paddingHorizontal: s(10),
                borderRadius: s(6),
                borderWidth: 1,
                borderColor:
                  status === "booked"
                    ? "#246BFD"
                    : status === "completed"
                      ? "#07BD74"
                      : "#F75555",
              }}
              className=""
            >
              <Text
                style={{ fontSize: s(10), letterSpacing: s(0.2) }}
                className={`${
                  status === "booked"
                    ? "text-primary-500"
                    : status === "completed"
                      ? "text-status-success"
                      : "text-status-error"
                } font-urbanist-semibold`}
              >
                {status === "booked"
                  ? "Booked"
                  : status === "completed"
                    ? "Completed"
                    : "Cancelled"}
              </Text>
            </View>
          </View>

          <Text
            style={{ fontSize: s(12), letterSpacing: s(0.2) }}
            className="font-urbanist-medium text-greyscale-800"
          >
            {appointment[0].start_time}
          </Text>
        </View>

        <View
          style={{
            gap: s(10),
            width: s(60),
            height: s(60),
            padding: s(16),
            borderRadius: s(50),
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(36, 107, 253, 0.08)",
          }}
        >
          <Image
            resizeMode="contain"
            style={{ width: s(28), height: s(28) }}
            source={TypeData[doctor_packages[0].type].icon}
          />
        </View>
      </View>

      {(status === "booked" || status === "completed") && (
        <View style={{ height: vs(1), backgroundColor: "#EEEEEE" }} />
      )}

      {(status === "booked" || status === "completed") && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: s(12),
          }}
        >
          <Pressable
            hitSlop={18}
            onPress={status === "booked" ? onCancel : onBookAgain}
            style={{
              gap: s(4),
              width: s(168),
              borderWidth: 2,
              borderColor: "#246BFD",
              borderRadius: s(50),
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: vs(6),
              paddingHorizontal: s(16),
              backgroundColor: "#FFFFFF",
            }}
          >
            <Text
              style={{ fontSize: s(14), letterSpacing: s(0.2) }}
              className="font-urbanist-semibold text-primary-500"
            >
              {status === "booked" ? "Cancel Appointment" : "Book Again"}
            </Text>
          </Pressable>

          <Pressable
            hitSlop={18}
            onPress={status === "booked" ? onReschedule : onLeaveReview}
            style={{
              gap: s(4),
              width: s(168),
              borderWidth: 2,
              borderColor: "#246BFD",
              borderRadius: s(50),
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: vs(6),
              paddingHorizontal: s(16),
              backgroundColor: "#246BFD",
            }}
          >
            <Text
              style={{ fontSize: s(14), letterSpacing: s(0.2) }}
              className="font-urbanist-semibold text-white"
            >
              {status === "booked" ? "Reschedule" : "Leave Review"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default AppointmentCard;
