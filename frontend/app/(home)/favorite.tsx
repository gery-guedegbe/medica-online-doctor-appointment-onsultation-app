import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { s, vs } from "@/utils/styling";
import { useRouter } from "expo-router";
import { IMAGES } from "@/constants/images";
import DoctorCard from "@/components/ui/DoctorCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFavoriteStore } from "@/store/useFavoriteStore";

const FILTERS = [
  { label: "All", specialty: null },
  { label: "General", specialty: "General Practitioner" },
  { label: "Dentist", specialty: "Dentist" },
  { label: "Nutritionist", specialty: "Nutritionist" },
  { label: "Allergist", specialty: "Allergist" },
];

const FavoriteScreen = () => {
  const router = useRouter();

  const { favorites, favoriteIds, isLoading, error, fetchFavorites, toggle } =
    useFavoriteStore();

  const [activeFilter, setActiveFilter] = useState("All");

  // Recharge les favoris à chaque fois que l'écran est affiché.
  // Comme le store est partagé, si l'utilisateur a modifié ses favoris
  // depuis TopDoctors, ils sont déjà à jour sans nouveau fetch.
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const activeSpecialty = FILTERS.find(
    (f) => f.label === activeFilter,
  )?.specialty;
  const filteredFavorites =
    activeSpecialty == null
      ? favorites
      : favorites.filter((d) => d.specialty === activeSpecialty);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingTop: vs(24),
          paddingBottom: vs(48),
          paddingHorizontal: s(24),
          gap: vs(24),
        }}
        className="bg-white dark:bg-dark-1"
      >
        {/* En-tête */}
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
                source={IMAGES.arrow_left_icon}
                style={{ flex: 1 }}
                resizeMode="contain"
              />
            </Pressable>

            <Text
              style={{ fontSize: s(24) }}
              className="font-urbanist-bold text-greyscale-900"
            >
              My Favorite Doctor
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

        {/* Filtres par spécialité */}
        <View>
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
        </View>

        {/* Contenu */}
        {isLoading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size="large" color="#246BFD" />
          </View>
        ) : error ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text
              style={{ fontSize: s(16) }}
              className="text-center font-urbanist-medium text-red-500"
            >
              {error}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredFavorites}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: vs(8),
              paddingHorizontal: s(4),
              gap: vs(12),
            }}
            renderItem={({ item }) => (
              <DoctorCard
                doctor={item}
                isFavorite={favoriteIds.has(item.id)}
                onPress={() =>
                  router.push({
                    pathname: "/(home)/doctor/[id]",
                    params: { id: item.id },
                  })
                }
                onFavoritePress={() => toggle(item)}
              />
            )}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: vs(40),
                }}
              >
                <Image
                  source={IMAGES.not_found_image}
                  resizeMode="contain"
                  style={{ width: s(339), height: vs(250) }}
                />
                <View style={{ gap: vs(12) }}>
                  <Text
                    style={{ fontSize: s(24) }}
                    className="text-center font-urbanist-bold text-greyscale-900"
                  >
                    Pas encore de favoris
                  </Text>
                  <Text
                    style={{ fontSize: s(18), letterSpacing: s(0.2) }}
                    className="text-center font-urbanist-regular text-greyscale-600"
                  >
                    Appuyez sur le cœur d'un médecin pour l'ajouter ici.
                  </Text>
                </View>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default FavoriteScreen;
