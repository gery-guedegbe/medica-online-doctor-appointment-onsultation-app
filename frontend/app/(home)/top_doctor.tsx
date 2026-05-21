import {
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
import React, { useEffect, useState } from "react";
import DoctorCard from "@/components/ui/DoctorCard";
import { useDoctorStore } from "@/store/useDoctorStore";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import { SafeAreaView } from "react-native-safe-area-context";

const FILTERS = [
  { label: "All", specialty: null },
  { label: "General", specialty: "General Practitioner" },
  { label: "Dentist", specialty: "Dentist" },
  { label: "Nutritionist", specialty: "Nutritionist" },
  { label: "Allergist", specialty: "Allergist" },
];

const TopDoctorScreen = () => {
  const router = useRouter();

  const { doctors, fetchDoctors } = useDoctorStore();

  const { favoriteIds, toggle, fetchFavorites } = useFavoriteStore();

  const [activeFilter, setActiveFilter] = useState("All");

  const activeSpecialty = FILTERS.find(
    (f) => f.label === activeFilter,
  )?.specialty;

  const filteredDoctors =
    activeSpecialty == null
      ? doctors
      : doctors.filter((d) => d.specialty === activeSpecialty);

  useEffect(() => {
    fetchDoctors();
    fetchFavorites();
  }, [fetchDoctors, fetchFavorites]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          paddingTop: vs(24),
          paddingBottom: vs(48),
          paddingHorizontal: s(24),

          gap: vs(32),
        }}
        className="flex-1 bg-white dark:bg-dark-1"
      >
        <View className="flex flex-row items-center justify-between">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: vs(12),
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
              className="font-urbanist-bold text-greyscale-900"
            >
              {"Top Doctor"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: vs(12),
            }}
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

        <View style={{ gap: vs(32) }}>
          {/* Filtres */}
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

          {/* Liste des docteurs */}
          <FlatList
            data={filteredDoctors}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: vs(8),
              paddingHorizontal: s(4),
              paddingBottom: vs(120),
              gap: vs(12),
            }}
            renderItem={({ item }) => (
              <DoctorCard
                doctor={item}
                isFavorite={favoriteIds.has(item.id)}
                onPress={() => router.push({ pathname: "/(home)/doctor/[id]", params: { id: item.id } })}
                onFavoritePress={() => toggle(item)}
              />
            )}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  alignContent: "center",
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
                    Not Found
                  </Text>

                  <Text
                    style={{
                      fontSize: s(18),
                      letterSpacing: s(0.2),
                    }}
                    className="text-center font-urbanist-regular text-greyscale-900"
                  >
                    Sorry, the keyword you entered cannot be found, please check
                    again or search with another keyword.
                  </Text>
                </View>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TopDoctorScreen;
