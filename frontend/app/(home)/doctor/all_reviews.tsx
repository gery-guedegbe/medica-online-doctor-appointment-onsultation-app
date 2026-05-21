import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { s, vs } from "@/utils/styling";
import { useLocalSearchParams, useRouter } from "expo-router";
import { IMAGES } from "@/constants/images";
import { SafeAreaView } from "react-native-safe-area-context";
import ReviewItem from "@/components/ui/ReviewItem";
import { REVIEWS } from "@/constants/data";

// Filtres par note — null = afficher tous
const STAR_FILTERS = [
  { label: "All", value: null },
  { label: "5", value: 5 },
  { label: "4", value: 4 },
  { label: "3", value: 3 },
  { label: "2", value: 2 },
];

const AllReviewsScreen = () => {
  const router = useRouter();
  const { rating } = useLocalSearchParams<{ rating: string }>();

  const [activeStars, setActiveStars] = useState<number | null>(null);

  const filteredReviews = useMemo(() => {
    if (activeStars === null) return REVIEWS;
    return REVIEWS.filter((r) => r.stars === activeStars);
  }, [activeStars]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingTop: vs(24),
          paddingBottom: vs(16),
          paddingHorizontal: s(24),
          gap: vs(24),
        }}
        className="bg-white dark:bg-dark-1"
      >
        {/* En-tête */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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

            {/* Titre : note + total avis */}
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: s(6) }}
            >
              <Text
                style={{ fontSize: s(24) }}
                className="font-urbanist-bold text-greyscale-900 dark:text-white"
              >
                {rating ? Number(rating).toFixed(1) : "4.8"} (4,942 reviews)
              </Text>
            </View>
          </View>

          <Pressable hitSlop={18} style={{ width: s(28), height: s(28) }}>
            <Image
              source={IMAGES.black_more_icon}
              style={{ flex: 1 }}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {/* Filtres par étoiles */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: s(12) }}
          style={{ flexGrow: 0 }}
        >
          {STAR_FILTERS.map((filter) => {
            const isActive = filter.value === activeStars;

            return (
              <Pressable
                key={filter.label}
                onPress={() => setActiveStars(filter.value)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: s(8),
                  paddingHorizontal: s(20),
                  paddingVertical: vs(8),
                  borderRadius: s(50),
                  borderWidth: 2,
                  borderColor: "#246BFD",
                  backgroundColor: isActive ? "#246BFD" : "transparent",
                }}
              >
                {filter.value !== null && (
                  <Image
                    source={IMAGES.star_icon}
                    style={{ width: s(16), height: s(16) }}
                    resizeMode="contain"
                    tintColor={isActive ? "#FFFFFF" : "#246BFD"}
                  />
                )}

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

        {/* Liste des avis */}
        <FlatList
          data={filteredReviews}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: vs(24), paddingBottom: vs(100) }}
          //   ItemSeparatorComponent={() => (
          //     <View style={{ height: 1, backgroundColor: "#F0F0F0" }} />
          //   )}
          renderItem={({ item }) => <ReviewItem review={item} />}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingTop: vs(60),
                gap: vs(12),
              }}
            >
              <Text
                style={{ fontSize: s(18) }}
                className="text-center font-urbanist-bold text-greyscale-900"
              >
                No reviews yet
              </Text>

              <Text
                style={{ fontSize: s(14), letterSpacing: s(0.2) }}
                className="text-center font-urbanist-regular text-greyscale-500"
              >
                No reviews with {activeStars} stars for this doctor.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default AllReviewsScreen;
