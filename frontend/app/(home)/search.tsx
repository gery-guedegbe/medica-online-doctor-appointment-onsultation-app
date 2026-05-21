import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { s, vs } from "@/utils/styling";
import { useRouter } from "expo-router";
import { IMAGES } from "@/constants/images";
import AppSearchBar from "@/components/ui/AppSearchBar";
import DoctorCard from "@/components/ui/DoctorCard";
import FilterBottomSheet, {
  FilterState,
} from "@/components/ui/FilterBottomSheet";
import LoadingIndicator from "@/components/loading/LoadingIndicator";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDoctorStore } from "@/store/useDoctorStore";
import { useFavoriteStore } from "@/store/useFavoriteStore";

const FILTERS = [
  { label: "All", specialty: null },
  { label: "General", specialty: "General Practitioner" },
  { label: "Dentist", specialty: "Dentist" },
  { label: "Nutritionist", specialty: "Nutritionist" },
  { label: "Allergist", specialty: "Allergist" },
];

const SearchScreen = () => {
  const router = useRouter();

  const { doctors, isLoading, fetchDoctors } = useDoctorStore();
  const { favoriteIds, toggle, fetchFavorites } = useFavoriteStore();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [filterVisible, setFilterVisible] = useState(false);
  const [advancedFilter, setAdvancedFilter] = useState<FilterState>({
    speciality: "All",
    rating: null,
  });

  useEffect(() => {
    if (doctors.length === 0) fetchDoctors();
    fetchFavorites();
  }, [fetchDoctors, fetchFavorites]);

  // Debounce : attend 400 ms après la dernière frappe avant de filtrer
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const activeSpecialty = FILTERS.find(
    (f) => f.label === activeFilter,
  )?.specialty;

  // Tous les filtres appliqués côté client sur le store déjà chargé
  const filteredResults = useMemo(() => {
    return doctors
      .filter((d) => {
        // Filtre texte sur nom et spécialité
        if (!debouncedQuery.trim()) return true;
        const q = debouncedQuery.toLowerCase();
        return (
          d.full_name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q)
        );
      })
      .filter((d) => {
        // Filtre catégorie (onglets rapides)
        if (activeSpecialty == null) return true;
        return d.specialty === activeSpecialty;
      })
      .filter((d) => {
        // Filtre spécialité avancé (FilterBottomSheet)
        if (advancedFilter.speciality === "All") return true;
        return d.specialty
          .toLowerCase()
          .includes(advancedFilter.speciality.toLowerCase());
      })
      .filter((d) => {
        // Filtre note minimale
        if (!advancedFilter.rating) return true;
        return d.rating >= advancedFilter.rating;
      });
  }, [doctors, debouncedQuery, activeSpecialty, advancedFilter]);

  const handleApplyFilter = useCallback((filter: FilterState) => {
    setAdvancedFilter(filter);
    setFilterVisible(false);
  }, []);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: s(24),
            paddingTop: vs(24),
            paddingBottom: vs(16),
            gap: vs(24),
          }}
          className="bg-white dark:bg-dark-1"
        >
          {/* En-tête : retour + barre de recherche */}
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

            <AppSearchBar
              value={query}
              isFocused={true}
              onChangeText={setQuery}
              onFilterPress={() => setFilterVisible(true)}
            />
          </View>

          {/* Filtres rapides par spécialité */}
          <View>
            <FlatList
              data={FILTERS}
              horizontal
              keyExtractor={(item) => item.label}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: s(12) }}
              style={{ flexGrow: 0 }}
              renderItem={({ item }) => {
                const isActive = item.label === activeFilter;
                return (
                  <Pressable
                    onPress={() => setActiveFilter(item.label)}
                    style={{
                      paddingHorizontal: s(20),
                      paddingVertical: vs(8),
                      borderRadius: s(50),
                      borderWidth: 1.5,
                      borderColor: isActive ? "#246BFD" : "#E0E0E0",
                      backgroundColor: isActive ? "#246BFD" : "transparent",
                    }}
                  >
                    <Text
                      style={{ fontSize: s(14) }}
                      className={
                        isActive
                          ? "font-urbanist-semibold text-white"
                          : "font-urbanist-semibold text-greyscale-700 dark:text-greyscale-300"
                      }
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>

          {/* Résultats */}
          {isLoading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LoadingIndicator />
            </View>
          ) : (
            <FlatList
              data={filteredResults}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingVertical: vs(8), gap: vs(12) }}
              ListHeaderComponent={
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: vs(8),
                  }}
                >
                  <Text
                    style={{ fontSize: s(16) }}
                    className="font-urbanist-bold text-greyscale-900 dark:text-white"
                  >
                    {filteredResults.length} found
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: s(6),
                    }}
                  >
                    <Text
                      style={{ fontSize: s(14) }}
                      className="font-urbanist-semibold text-primary-500"
                    >
                      Default
                    </Text>
                    <Image
                      source={IMAGES.swap_icon}
                      resizeMode="contain"
                      style={{ width: s(18), height: s(18) }}
                    />
                  </View>
                </View>
              }
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
                    gap: vs(24),
                    paddingTop: vs(60),
                  }}
                >
                  <Image
                    source={IMAGES.not_found_image}
                    resizeMode="contain"
                    style={{ width: s(260), height: vs(200) }}
                  />
                  <View style={{ gap: vs(10) }}>
                    <Text
                      style={{ fontSize: s(22) }}
                      className="text-center font-urbanist-bold text-greyscale-900 dark:text-white"
                    >
                      Not Found
                    </Text>
                    <Text
                      style={{
                        fontSize: s(15),
                        letterSpacing: s(0.2),
                        lineHeight: vs(24),
                      }}
                      className="text-center font-urbanist-regular text-greyscale-500"
                    >
                      No doctor matches your search. Try a different name or
                      specialty.
                    </Text>
                  </View>
                </View>
              }
            />
          )}
        </View>
      </SafeAreaView>

      {/* Filtre avancé (bottom sheet) */}
      <FilterBottomSheet
        visible={filterVisible}
        initialFilter={advancedFilter}
        onApply={handleApplyFilter}
        onClose={() => setFilterVisible(false)}
      />
    </>
  );
};

export default SearchScreen;
