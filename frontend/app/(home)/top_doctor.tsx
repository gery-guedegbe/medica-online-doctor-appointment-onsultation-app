import React, { useState } from "react";
import { s, vs } from "@/utils/styling";
import { useRouter } from "expo-router";
import { DOCTORS } from "@/constants/data";
import { IMAGES } from "@/constants/images";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import DoctorCard from "@/components/ui/DoctorCard";

const FILTERS = ["All", "General", "Dentist", "Nutritionist", "Allergists"];

const TopDoctorScreen = () => {
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState("All");
  const [doctors, setDoctors] = useState(DOCTORS);

  const filteredDoctors =
    activeFilter === "All"
      ? doctors
      : doctors.filter((d) => d.category === activeFilter);

  const toggleFavorite = (id: string) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d)),
    );
  };

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
              const isActive = filter === activeFilter;

              return (
                <Pressable
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
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
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Liste des docteurs */}
          <FlatList
            data={filteredDoctors}
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
                // onPress={() => router.push(`/(home)/doctor/${item.id}`)}
                onFavoritePress={() => toggleFavorite(item.id)}
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
