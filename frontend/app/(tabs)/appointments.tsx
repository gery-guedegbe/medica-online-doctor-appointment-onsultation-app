import { IMAGES } from "@/constants/images";
import { useAppointmentStore } from "@/store/useAppointmentStore";
import { AppointmentFilter } from "@/services/appointmentService";
import { Appointment, Doctor, DoctorPackage } from "@/types";
import { s, vs } from "@/utils/styling";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppointmentCard from "@/components/appointment/AppointmentCard";

// ─── Config des onglets ────────────────────────────────────────────────────────

const TABS: { label: string; filter: AppointmentFilter }[] = [
  { label: "Upcoming", filter: "upcoming" },
  { label: "Completed", filter: "completed" },
  { label: "Cancelled", filter: "cancelled" },
];

// ─── Adaptateurs API → props de AppointmentCard ───────────────────────────────
// L'API retourne des objets imbriqués (doctors.users, doctor_packages).
// AppointmentCard attend des props plates. Ces helpers font la conversion.

const toDoctor = (apt: Appointment): Doctor => ({
  id: apt.doctors.id,
  user_id: "",
  full_name: apt.doctors.users.full_name,
  avatar_url: apt.doctors.users.avatar_url,
  specialty: apt.doctors.specialty,
  experience_years: 0,
  rating: 0,
  bio: "",
  hospital_name: "",
  hospital_address: "",
  hospital_country: "",
  patients_count: 0,
  packages: [],
});

const toPackages = (apt: Appointment): DoctorPackage[] => [
  {
    id: "",
    type: apt.doctor_packages.type,
    price: apt.doctor_packages.price,
    duration_minutes: apt.doctor_packages.duration_minutes,
  },
];

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

// ─── Screen ───────────────────────────────────────────────────────────────────

const AppointmentScreen = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AppointmentFilter>("upcoming");
  const { appointments, isLoading, fetchAppointments, cancelAppointment } =
    useAppointmentStore();

  // Recharge la liste à chaque changement d'onglet
  useEffect(() => {
    fetchAppointments(activeTab);
  }, [activeTab, fetchAppointments]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        className="bg-white dark:bg-dark-1"
      >
        <View
          style={{
            gap: vs(28),
            paddingTop: vs(24),
            paddingBottom: vs(48),
            paddingHorizontal: s(24),
          }}
          className="flex-1"
        >
          {/* ── En-tête ── */}
          <View className="flex flex-row items-center justify-between">
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: s(12) }}
            >
              <Image
                resizeMode="contain"
                source={IMAGES.app_icon_2}
                style={{ width: s(28), height: s(28) }}
              />

              <Text
                style={{ fontSize: s(24) }}
                className="font-urbanist-bold text-greyscale-900"
              >
                My Appointments
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: s(12) }}
            >
              <Pressable
                hitSlop={18}
                onPress={() => router.push("/(home)/search")}
                style={{ width: s(28), height: s(28) }}
              >
                <Image
                  source={IMAGES.search_black_icon}
                  style={{ flex: 1 }}
                  resizeMode="contain"
                />
              </Pressable>

              <Pressable hitSlop={18} style={{ width: s(28), height: s(28) }}>
                <Image
                  source={IMAGES.black_more_icon}
                  style={{ flex: 1 }}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          </View>

          {/* ── Onglets ── */}
          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 2,
              borderBottomColor: "#EEEEEE",
            }}
          >
            {TABS.map(({ label, filter }) => {
              const isActive = activeTab === filter;

              return (
                <Pressable
                  key={filter}
                  onPress={() => setActiveTab(filter)}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    paddingBottom: vs(12),
                    borderBottomWidth: 4,
                    borderBottomColor: isActive ? "#246BFD" : "transparent",
                    marginBottom: -2,
                  }}
                >
                  <Text
                    style={{ fontSize: s(18), letterSpacing: s(0.2) }}
                    className={
                      isActive
                        ? "font-urbanist-bold text-primary-500"
                        : "font-urbanist-medium text-greyscale-500"
                    }
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* ── Contenu ── */}
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#246BFD"
              style={{ marginTop: vs(48) }}
            />
          ) : appointments.length === 0 ? (
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
                  You don&apos;t have an appointment yet
                </Text>

                <Text
                  style={{ fontSize: s(16), letterSpacing: 0.2 }}
                  className="text-center font-urbanist-regular text-greyscale-900"
                >
                  You don&apos;t have a doctor&apos;s appointment scheduled at
                  the moment.
                </Text>
              </View>
            </View>
          ) : (
            /* Liste des rendez-vous */
            <View style={{ gap: vs(20) }}>
              {appointments.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  status={apt.status}
                  doctor={toDoctor(apt)}
                  doctor_packages={toPackages(apt)}
                  appointment={[
                    { ...apt, start_time: formatDateTime(apt.start_time) },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: `/(my_appointments)/my_appointment_details`,
                      params: { id: apt.id, doctorId: apt.doctors.id },
                    })
                  }
                  onCancel={() => cancelAppointment(apt.id)}
                  onReschedule={() =>
                    router.push({
                      pathname: `/(my_appointments)/reschedule_appointment`,
                      params: { id: apt.id, doctorId: apt.doctors.id },
                    })
                  }
                  onBookAgain={() =>
                    router.push({
                      pathname: `/(home)/appointment/book_appointment`,
                      params: {
                        doctorId: apt.doctors.id,
                      },
                    })
                  }
                  onLeaveReview={() =>
                    router.push({
                      pathname: `/(my_appointments)/leave_review`,
                      params: { id: apt.id },
                    })
                  }
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppointmentScreen;
