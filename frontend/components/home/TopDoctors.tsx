import React, { useState } from "react";
import { useRouter } from "expo-router";
import { s, vs } from "@/utils/styling";
import DoctorCard from "../ui/DoctorCard";
import { DOCTORS } from "@/constants/data";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";

const FILTERS = ["All", "General", "Dentist", "Nutritionist", "Allergists"];

const TopDoctors = () => {
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
    <View style={{ gap: vs(32) }}>
      <View className="flex flex-row items-center justify-between">
        <Text
          style={{ fontSize: s(20) }}
          className="textgreyscale-900 font-urbanist-bold"
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
              gap: vs(12),
              alignContent: "center",
              justifyContent: "center",
            }}
          >
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
              Sorry, the keyword you entered cannot be found, please check again
              or search with another keyword.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default TopDoctors;
