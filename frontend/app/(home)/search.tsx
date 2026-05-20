import LoadingIndicator from "@/components/loading/LoadingIndicator";
import AppSearchBar from "@/components/ui/AppSearchBar";
import DoctorCard from "@/components/ui/DoctorCard";
import FilterBottomSheet, {
  FilterState,
} from "@/components/ui/FilterBottomSheet";
import { DOCTORS } from "@/constants/data";
import { IMAGES } from "@/constants/images";
import { Doctor } from "@/types";
import { s, vs } from "@/utils/styling";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FILTERS = ["All", "General", "Dentist", "Nutritionist", "Allergists"];

const SearchScreen = () => {
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState("All");

  const fetchDoctors = async (query: string): Promise<Doctor[]> => {
    await new Promise((r) => setTimeout(r, 800)); // simule latence réseau
    if (!query.trim()) return DOCTORS;
    return DOCTORS.filter((d) =>
      d.name.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeAdvancedFilter, setActiveAdvancedFilter] = useState<FilterState>(
    {
      speciality: "All",
      rating: null,
    },
  );
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(DOCTORS.map((d) => [d.id, d.isFavorite ?? false])),
  );

  // Recherche avec debounce
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(async () => {
      const data = await fetchDoctors(query);
      setResults(data);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Application des filtres côté client
  // → Quand le backend est branché, passe ces filtres en params de requête
  const filteredResults = useMemo(() => {
    return results
      .filter((d) => activeFilter === "All" || d.category === activeFilter)
      .filter((d) =>
        activeAdvancedFilter.speciality === "All"
          ? true
          : d.category === activeAdvancedFilter.speciality,
      )
      .filter((d) =>
        activeAdvancedFilter.rating
          ? d.rating >= activeAdvancedFilter.rating
          : true,
      )
      .map((d) => ({ ...d, isFavorite: favorites[d.id] ?? false }));
  }, [results, activeFilter, activeAdvancedFilter, favorites]);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: s(24),
            paddingTop: vs(24),
            paddingBottom: vs(48),
            gap: vs(32),
          }}
          className="flex-1 bg-white dark:bg-dark-1"
        >
          <View
            style={{ gap: vs(16) }}
            className="flex flex-row items-center justify-between"
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

          <View>
            {/* Liste des docteurs */}

            <FlatList
              data={FILTERS}
              horizontal
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: s(12) }}
              style={{ flexGrow: 0 }}
              renderItem={({ item }) => {
                const isActive = item === activeFilter;

                return (
                  <Pressable
                    onPress={() => setActiveFilter(item)}
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
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>

          {/* Contenu */}
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
              contentContainerStyle={{ paddingVertical: vs(8), gap: vs(16) }}
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
                    style={{ fontSize: s(18) }}
                    className="font-urbanist-bold text-greyscale-900 dark:text-white"
                  >
                    {`${filteredResults.length} found`}
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
                  // onPress={() => router.push(`/(home)/doctor/${item.id}`)}
                  onFavoritePress={() => toggleFavorite(item.id)}
                />
              )}
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    gap: vs(32),
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
                      Sorry, the keyword you entered cannot be found, please
                      check again or search with another keyword.
                    </Text>
                  </View>
                </View>
              }
            />
          )}
        </View>
      </SafeAreaView>

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        visible={filterVisible}
        initialFilter={activeAdvancedFilter}
        onApply={setActiveAdvancedFilter}
        onClose={() => setFilterVisible(false)}
      />
    </>
  );
};

export default SearchScreen;
