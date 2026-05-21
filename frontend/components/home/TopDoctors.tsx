import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { s, vs } from "@/utils/styling";
import DoctorCard from "../ui/DoctorCard";
import { useDoctorStore } from "@/store/useDoctorStore";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const FILTERS = [
  { label: "All", specialty: null },
  { label: "General", specialty: "General Practitioner" },
  { label: "Dentist", specialty: "Dentist" },
  { label: "Nutritionist", specialty: "Nutritionist" },
  { label: "Allergist", specialty: "Allergist" },
];

const TopDoctors = () => {
  const router = useRouter();

  const { doctors, isLoading, error, fetchDoctors } = useDoctorStore();

  // favoriteIds : Set<string> pour savoir en O(1) si un médecin est favori
  // toggle      : ajoute/retire avec mise à jour optimiste + appel API
  const { favoriteIds, toggle, fetchFavorites } = useFavoriteStore();

  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetchDoctors();
    fetchFavorites(); // charge les favoris existants au montage
  }, [fetchDoctors, fetchFavorites]);

  const activeSpecialty = FILTERS.find(
    (f) => f.label === activeFilter,
  )?.specialty;
  const filteredDoctors =
    activeSpecialty == null
      ? doctors
      : doctors.filter((d) => d.specialty === activeSpecialty);

  if (isLoading) {
    return (
      <View style={{ paddingVertical: vs(32), alignItems: "center" }}>
        <ActivityIndicator size="large" color="#246BFD" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ paddingVertical: vs(32), alignItems: "center" }}>
        <Text
          style={{ fontSize: s(16) }}
          className="text-center font-urbanist-medium text-red-500"
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ gap: vs(32) }}>
      {/* En-tête */}
      <View className="flex flex-row items-center justify-between">
        <Text
          style={{ fontSize: s(20) }}
          className="font-urbanist-bold text-greyscale-900"
        >
          Top Doctors
        </Text>

        <Pressable
          hitSlop={16}
          onPress={() => router.push("/(home)/top_doctor")}
        >
          <Text
            style={{ fontSize: s(16), letterSpacing: s(0.2) }}
            className="font-urbanist-bold text-primary-500"
          >
            See All
          </Text>
        </Pressable>
      </View>

      {/* Filtres par spécialité */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: s(12) }}
      >
        {FILTERS.map((filter) => {
          const isActive = filter.label === activeFilter;
          return (
            <Pressable
              key={filter.label}
              onPress={() => setActiveFilter(filter.label)}
              style={{
                paddingHorizontal: s(20),
                paddingVertical: vs(8),
                borderRadius: s(50),
                borderWidth: 2,
                borderColor: "#246BFD",
                backgroundColor: isActive ? "#246BFD" : "transparent",
              }}
            >
              <Text
                style={{ fontSize: s(16), letterSpacing: s(0.2) }}
                className={
                  isActive
                    ? "font-urbanist-semibold text-white"
                    : "font-urbanist-semibold text-primary-500 dark:text-greyscale-300"
                }
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Liste des médecins */}
      <FlatList
        data={filteredDoctors.slice(0, 5)} // Affiche seulement les 5 premierss
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={{
          paddingVertical: vs(8),
          paddingHorizontal: s(4),
          gap: vs(12),
        }}
        renderItem={({ item }) => (
          <DoctorCard
            doctor={item}
            isFavorite={favoriteIds.has(item.id)}
            onFavoritePress={() => toggle(item)}
            onPress={() =>
              router.push({
                pathname: "/(home)/doctor/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={{ gap: vs(12), alignItems: "center" }}>
            <Text
              style={{ fontSize: s(18) }}
              className="text-center font-urbanist-bold text-greyscale-900"
            >
              Aucun médecin trouvé
            </Text>
            <Text
              style={{ fontSize: s(15), letterSpacing: s(0.2) }}
              className="text-center font-urbanist-regular text-greyscale-600"
            >
              Aucun résultat pour ce filtre.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default TopDoctors;
