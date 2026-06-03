import React, { use, useEffect } from "react";
import { s, vs } from "@/utils/styling";
import { useLocalSearchParams, useRouter } from "expo-router";
import { IMAGES } from "@/constants/images";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useAppointmentStore } from "@/store/useAppointmentStore";
import { useDoctorStore } from "@/store/useDoctorStore";
import { TypeData } from "../(home)/appointment/select_package";
import MyAppointmentPackageCard from "@/components/appointment/MyAppointmentPackageCard";
import MyAppointmentButton from "@/components/appointment/MyAppointmentButton";

const MyAppointmentDetailScreen = () => {
  const router = useRouter();
  s;
  const { id, doctorId } = useLocalSearchParams<{
    id: string;
    doctorId: string;
  }>();

  const doctor = useDoctorStore((state) =>
    state.doctors.find((d) => d.id === doctorId),
  );

  const { selectedAppointment, isLoading, fetchAppointmentById } =
    useAppointmentStore();

  const formatDateTime = (iso: string): string => {
    const date = new Date(iso);
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }) +
      " | " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  useEffect(() => {
    fetchAppointmentById(id);
  }, [id, fetchAppointmentById]);

  console.log(
    `My Appointment Details: ${JSON.stringify(selectedAppointment)}, Doctor Details: ${JSON.stringify(doctor)}`,
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        className="bg-white dark:bg-dark-1"
      >
        <View
          style={{
            flex: 1,
            gap: vs(28),
            paddingTop: vs(24),
            paddingBottom: vs(48),
            paddingHorizontal: s(24),
          }}
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
                  resizeMode="contain"
                  source={IMAGES.arrow_left_icon}
                  style={{ flex: 1 }}
                />
              </Pressable>

              <Text
                style={{ fontSize: s(24) }}
                className="font-urbanist-bold text-greyscale-900"
              >
                My Appointment
              </Text>
            </View>

            <Pressable hitSlop={18} style={{ width: s(28), height: s(28) }}>
              <Image
                source={IMAGES.black_more_icon}
                style={{ flex: 1 }}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#246BFD"
              style={{ marginTop: vs(48) }}
            />
          ) : selectedAppointment === null ? (
            /* État vide */
            <View
              style={{
                flex: 1,
                gap: vs(20),
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: vs(80),
              }}
            >
              <Image
                source={IMAGES.appointment_not_found_image}
                resizeMode="contain"
                style={{ width: s(225), height: vs(220) }}
              />

              <View style={{ gap: vs(12), alignItems: "center" }}>
                <Text
                  style={{ fontSize: s(20) }}
                  className="text-center font-urbanist-bold text-greyscale-900 dark:text-white"
                >
                  No appointment found.
                </Text>

                <Text
                  style={{ fontSize: s(16), letterSpacing: 0.2 }}
                  className="text-center font-urbanist-regular text-greyscale-900"
                >
                  You don&apos;t have any appointment scheduled at the moment.
                </Text>
              </View>
            </View>
          ) : (
            /* Liste des rendez-vous */
            <View style={{ flex: 1, gap: vs(20) }}>
              <View
                style={{
                  height: s(142),
                  borderRadius: s(24),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: s(16),
                  padding: s(16),
                  boxShadow: "0 4px 60px 0 rgba(4, 6, 15, 0.05)",
                }}
                className="bg-white dark:bg-dark-2"
              >
                <Image
                  source={{
                    uri: selectedAppointment?.doctors.users.avatar_url,
                  }}
                  style={{ width: s(110), height: s(110), borderRadius: s(16) }}
                  resizeMode="cover"
                />

                {/* Infos */}
                <View style={{ flex: 1, gap: vs(14) }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: s(8),
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{ flex: 1, fontSize: s(18) }}
                      className="font-urbanist-bold text-greyscale-900 dark:text-white"
                    >
                      {selectedAppointment?.doctors.users.full_name}
                    </Text>
                  </View>

                  <View style={{ height: vs(1), backgroundColor: "#EEEEEE" }} />

                  <Text
                    numberOfLines={1}
                    style={{ fontSize: s(12), letterSpacing: s(0.2) }}
                    className="font-urbanist-medium text-greyscale-800"
                  >
                    {selectedAppointment?.doctors.specialty}
                  </Text>

                  <Text
                    numberOfLines={2}
                    style={{ fontSize: s(12), letterSpacing: s(0.2) }}
                    className="font-urbanist-medium text-greyscale-800"
                  >
                    {`${doctor?.hospital_name}, ${doctor?.hospital_address}, ${doctor?.hospital_country}`}
                  </Text>
                </View>
              </View>

              <View style={{ gap: vs(16) }}>
                <Text
                  style={{ fontSize: s(20) }}
                  className="font-urbanist-bold text-greyscale-900"
                >
                  Scheduled Appointment
                </Text>

                <View style={{ gap: vs(12) }}>
                  <Text
                    style={{ fontSize: s(16), letterSpacing: s(0.2) }}
                    className="font-urbanist-regular text-greyscale-800"
                  >
                    {`${formatDateTime(selectedAppointment?.start_time)} - ${formatDateTime(selectedAppointment?.end_time)} (${selectedAppointment?.doctor_packages.duration_minutes} minutes)`}
                  </Text>
                </View>
              </View>

              <View style={{ gap: vs(16) }}>
                <Text
                  style={{ fontSize: s(20) }}
                  className="font-urbanist-bold text-greyscale-900"
                >
                  Patient Information
                </Text>

                <View style={{ gap: vs(12) }}>
                  <Text
                    style={{ fontSize: s(16), letterSpacing: s(0.2) }}
                    className="font-urbanist-regular text-greyscale-800"
                  >
                    {`Full Name   : ${selectedAppointment?.patient_name}`}
                  </Text>

                  <Text
                    style={{ fontSize: s(16), letterSpacing: s(0.2) }}
                    className="font-urbanist-regular text-greyscale-800"
                  >
                    {`Age   : ${selectedAppointment?.patient_age}`}
                  </Text>

                  <Text
                    style={{ fontSize: s(16), letterSpacing: s(0.2) }}
                    className="font-urbanist-regular text-greyscale-800"
                  >
                    {`Problem   : ${selectedAppointment?.problem_description}`}
                  </Text>
                </View>
              </View>

              <View style={{ gap: vs(16) }}>
                <Text
                  style={{ fontSize: s(20) }}
                  className="font-urbanist-bold text-greyscale-900"
                >
                  Your Package
                </Text>

                <MyAppointmentPackageCard
                  price={selectedAppointment.doctor_packages.price}
                  desc={TypeData[selectedAppointment.doctor_packages.type].desc}
                  icon={TypeData[selectedAppointment.doctor_packages.type].icon}
                  duration={
                    selectedAppointment.doctor_packages.duration_minutes
                  }
                  label={
                    TypeData[selectedAppointment.doctor_packages.type].label
                  }
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {selectedAppointment && (
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
          <MyAppointmentButton
            onPress={() => {}}
            time={selectedAppointment.start_time}
            title={TypeData[selectedAppointment.doctor_packages.type].label}
            icon={TypeData[selectedAppointment.doctor_packages.type].icon}
            className={
              selectedAppointment.status === "booked"
                ? "bg-primary-500"
                : "bg-greyscale-200"
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default MyAppointmentDetailScreen;
