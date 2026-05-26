import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { s, vs } from "@/utils/styling";
import { formatTime } from "@/services/availabilityService";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TimeSlot {
  start: string; // "09:00"
  end: string; // "09:30"
  available: boolean;
}

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSlotSelect: (slot: TimeSlot) => void;
  isLoading?: boolean;
}

// ─── Composant ────────────────────────────────────────────────────────────────

const TimeSlotPicker = ({
  slots,
  selectedSlot,
  onSlotSelect,
  isLoading = false,
}: TimeSlotPickerProps) => {
  // ── État de chargement ────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View style={{ paddingVertical: vs(24), alignItems: "center" }}>
        <ActivityIndicator size="small" color="#246BFD" />
      </View>
    );
  }

  // ── Aucun slot disponible ─────────────────────────────────────────────────

  if (slots.length === 0) {
    return (
      <View style={{ paddingVertical: vs(18), alignItems: "center" }}>
        <Text
          style={{ fontSize: s(16) }}
          className="font-urbanist-medium text-greyscale-500"
        >
          No available slots for this date.
        </Text>
      </View>
    );
  }

  // ── Rendu d'un slot ───────────────────────────────────────────────────────

  const renderSlot = ({ item }: { item: TimeSlot }) => {
    // Un slot est "sélectionné" si son heure de début correspond
    const isSelected =
      selectedSlot !== null && selectedSlot.start === item.start;

    const isDisabled = !item.available;

    return (
      <Pressable
        onPress={() => onSlotSelect(item)}
        disabled={isDisabled}
        // style={({ pressed }) => ({
        //   // Chaque item prend exactement 1/3 de la largeur disponible
        //   flex: 1,
        //   borderWidth: 2,
        //   borderStyle: "solid",
        //   borderRadius: s(50),
        //   overflow: "hidden",
        //   alignItems: "center",
        //   justifyContent: "center",
        //   paddingHorizontal: s(24),
        //   paddingVertical: vs(10),
        //   opacity: pressed ? 0.75 : 1,
        //   // Couleur de fond et de bordure selon l'état
        //   borderColor: isDisabled
        //     ? "#E0E0E0"
        //     : isSelected
        //       ? "#246BFD"
        //       : "#246BFD",
        //   backgroundColor: isDisabled
        //     ? "transparent"
        //     : isSelected
        //       ? "#246BFD"
        //       : "transparent",
        // })}
        className={`h-[45px] max-w-[118px] flex-1 items-center justify-center rounded-full border-2 ${
          isDisabled
            ? "bg-greyscale-200"
            : isSelected
              ? "bg-primary-500"
              : "bg-white"
        } ${
          isDisabled
            ? "border-greyscale-200"
            : isSelected
              ? "border-primary-500"
              : "border-primary-500"
        }`}
      >
        <Text
          style={{ fontSize: s(18), letterSpacing: s(0.2) }}
          className={
            isDisabled
              ? "font-urbanist-medium text-greyscale-400"
              : isSelected
                ? "font-urbanist-bold text-white"
                : "font-urbanist-semibold text-primary-500"
          }
        >
          {/* Affiche uniquement l'heure de début formatée : "09:00 AM" */}
          {formatTime(item.start)}
        </Text>
      </Pressable>
    );
  };

  // ── Grille 3 colonnes ─────────────────────────────────────────────────────

  return (
    <FlatList
      data={slots}
      scrollEnabled={false}
      keyExtractor={(item) => item.start}
      numColumns={3}
      style={styles.flatList}
      columnWrapperStyle={{ gap: s(12) }}
      contentContainerStyle={{ gap: vs(12) }}
      renderItem={renderSlot}
    />
  );
};

const styles = StyleSheet.create({
  flatList: {
    width: "100%",
  },
  slotBase: {
    flex: 1,
    height: s(45),
    maxWidth: s(118),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: s(50),
    borderWidth: s(2),
    borderStyle: "solid",
  },
});

export default TimeSlotPicker;
