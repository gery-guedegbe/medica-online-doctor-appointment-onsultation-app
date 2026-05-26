import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { s, vs } from "@/utils/styling";
import { IMAGES } from "@/constants/images";
import AppButton from "@/components/ui/AppButton";
import CalendarPicker from "@/components/ui/CalendarPicker";
import TimeSlotPicker, { TimeSlot } from "@/components/ui/TimeSlotPicker";
import { getDoctorSlots } from "@/services/availabilityService";

const BookAppointmentScreen = () => {
  const router = useRouter();
  const { doctorId } = useLocalSearchParams<{ doctorId: string }>();

  const today = new Date();

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // ── Fetch slots à chaque changement de date ───────────────────────────────
  // On réinitialise aussi le slot sélectionné : une date différente
  // peut avoir des créneaux complètement différents.
  useEffect(() => {
    if (!doctorId) return;

    setLoadingSlots(true);
    setSelectedSlot(null);

    getDoctorSlots(doctorId, selectedDate)
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [doctorId, selectedDate]);

  // ── Le bouton "Next" n'est actif que si un créneau est sélectionné ────────
  const canProceed = selectedSlot !== null;

  const handleNext = () => {
    if (!canProceed || !doctorId) return;
    // Passe les informations de réservation à l'écran de confirmation
    router.push({
      pathname: "/(home)/appointment/select_package",
      params: {
        doctorId,
        date: selectedDate.toISOString(),
        slotStart: selectedSlot!.start,
        slotEnd: selectedSlot!.end,
      },
    });
  };

  // ── Rendu ─────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }} className="bg-white dark:bg-dark-1">
        {/* ── En-tête ── */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: s(12),
            paddingHorizontal: s(24),
            paddingTop: vs(24),
            paddingBottom: vs(12),
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
            Book Appointment
          </Text>
        </View>

        {/* ── Contenu scrollable ── */}
        {/* paddingBottom: vs(120) → espace sous le dernier élément
            pour qu'il ne soit pas caché par le bouton fixe du bas */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: s(24),
            paddingTop: vs(8),
            paddingBottom: vs(120),
            gap: vs(32),
          }}
        >
          {/* ── Section calendrier ── */}
          <View style={{ gap: vs(16) }}>
            <Text
              style={{ fontSize: s(20) }}
              className="font-urbanist-bold text-greyscale-900 dark:text-white"
            >
              Select Date
            </Text>

            <CalendarPicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              minDate={today}
            />
          </View>

          {/* ── Section créneaux horaires ── */}
          <View style={{ gap: vs(16) }}>
            <Text
              style={{ fontSize: s(20) }}
              className="font-urbanist-bold text-greyscale-900 dark:text-white"
            >
              Select Hour
            </Text>

            <TimeSlotPicker
              slots={slots}
              selectedSlot={selectedSlot}
              onSlotSelect={setSelectedSlot}
              isLoading={loadingSlots}
            />
          </View>
        </ScrollView>

        {/* ── Bouton "Next" fixe en bas ── */}
        {/* position: absolute → reste visible même en scrollant */}
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

export default BookAppointmentScreen;
