import React, { useState } from "react";
import {
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { s, vs } from "@/utils/styling";
import { IMAGES } from "@/constants/images";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// En-têtes de colonnes : semaine commençant le Lundi (comme la maquette)
const DAY_HEADERS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

interface CalendarPickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  // Bloque la sélection des jours antérieurs à minDate (défaut : aujourd'hui)
  minDate?: Date;
}

// Retourne le nombre de jours dans un mois donné
const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

// Retourne le décalage du 1er jour du mois en convention Lundi=0
// JavaScript : getDay() → 0=Dim, 1=Lun, ..., 6=Sam
// On veut    :            0=Lun, 1=Mar, ..., 6=Dim
// Formule    : (jsDay + 6) % 7
const getFirstDayOffset = (year: number, month: number) => {
  const jsDay = new Date(year, month, 1).getDay();
  return (jsDay + 6) % 7;
};

// Découpe un tableau en tranches de `size` éléments
function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// ─── Composant ────────────────────────────────────────────────────────────────

const CalendarPicker = ({
  selectedDate,
  onDateChange,
  minDate,
}: CalendarPickerProps) => {
  const { width } = useWindowDimensions();

  // Mois actuellement affiché dans le calendrier
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());

  // ── Calcul des cellules ────────────────────────────────────────────────────

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstOffset = getFirstDayOffset(viewYear, viewMonth);

  // Tableau de cellules : null = case vide, number = numéro du jour
  const cells: (number | null)[] = [
    ...Array<null>(firstOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Padding qui entoure le calendrier (screen + container intérieur)
  const CONTAINER_PADDING = s(24) * 2 + s(16) * 2;
  const cellWidth = (width - CONTAINER_PADDING) / 7;
  // Le cercle de sélection fait au plus 40sp pour rester bien proportionné
  const circleSize = Math.min(cellWidth - s(4), s(40));

  const rows = chunk(cells, 7);

  // ── Navigation ────────────────────────────────────────────────────────────

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // ── États d'un jour ───────────────────────────────────────────────────────

  const isSelected = (day: number | null) => {
    if (!day || !selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getFullYear() === viewYear
    );
  };

  const isPast = (day: number | null) => {
    if (!day) return false;
    const ref = minDate ?? new Date();
    const candidate = new Date(viewYear, viewMonth, day);
    // Compare uniquement les dates (sans l'heure)
    return (
      candidate.getFullYear() < ref.getFullYear() ||
      (candidate.getFullYear() === ref.getFullYear() &&
        candidate.getMonth() < ref.getMonth()) ||
      (candidate.getFullYear() === ref.getFullYear() &&
        candidate.getMonth() === ref.getMonth() &&
        candidate.getDate() < ref.getDate())
    );
  };

  const handleDayPress = (day: number | null) => {
    if (!day || isPast(day)) return;
    onDateChange(new Date(viewYear, viewMonth, day));
  };

  // ── Rendu ─────────────────────────────────────────────────────────────────

  return (
    <View
      style={{
        gap: vs(12),
        padding: s(16),
        borderRadius: s(24),
        backgroundColor: "#EEF4FF",
      }}
    >
      {/* ── Header : mois + navigation ── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: vs(12),
        }}
      >
        <Text
          style={{ fontSize: s(18), letterSpacing: 0.2 }}
          className="font-urbanist-bold text-greyscale-900 dark:text-white"
        >
          {MONTHS[viewMonth]} {viewYear}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: s(4) }}>
          {/* Flèche précédent */}
          <Pressable hitSlop={12} onPress={goToPrevMonth}>
            <Image
              source={IMAGES.arrow_left_bold}
              style={{ width: s(20), height: s(20) }}
              resizeMode="contain"
              // tintColor="#246BFD"
            />
          </Pressable>

          {/* Flèche suivant — miroir horizontal de arrow_left */}
          <Pressable hitSlop={12} onPress={goToNextMonth}>
            <Image
              source={IMAGES.arrow_right_bold}
              style={{
                width: s(20),
                height: s(20),
              }}
              resizeMode="contain"
              tintColor="#246BFD"
            />
          </Pressable>
        </View>
      </View>

      {/* ── En-têtes des colonnes (Mo Tu We...) ── */}
      <View style={{ flexDirection: "row" }}>
        {DAY_HEADERS.map((label) => (
          <View key={label} style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{ fontSize: s(12), letterSpacing: 0.2 }}
              className="font-urbanist-bold text-greyscale-900"
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Grille des jours ── */}
      <View style={{ gap: vs(4) }}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: "row" }}>
            {row.map((day, colIndex) => {
              const selected = isSelected(day);
              const past = isPast(day);

              return (
                <Pressable
                  key={colIndex}
                  onPress={() => handleDayPress(day)}
                  disabled={!day || past}
                  style={{
                    flex: 1,
                    height: cellWidth,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {day !== null && (
                    <View
                      style={{
                        padding: s(10),
                        width: circleSize,
                        height: circleSize,
                        borderRadius: s(50),
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: selected ? "#246BFD" : "transparent",
                      }}
                    >
                      <Text
                        style={{ fontSize: s(14), letterSpacing: 0.2 }}
                        className={
                          selected
                            ? "font-urbanist-bold text-white"
                            : past
                              ? "font-urbanist-bold text-greyscale-400"
                              : "font-urbanist-medium text-greyscale-800 dark:text-white"
                        }
                      >
                        {day}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}

            {/* Compléter la dernière ligne avec des cellules vides si besoin */}
            {row.length < 7 &&
              Array(7 - row.length)
                .fill(null)
                .map((_, i) => <View key={`pad-${i}`} style={{ flex: 1 }} />)}
          </View>
        ))}
      </View>
    </View>
  );
};

export default CalendarPicker;
