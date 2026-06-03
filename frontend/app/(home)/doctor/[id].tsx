import React, { useEffect, useState } from "react";
import { IMAGES } from "@/constants/images";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDoctorStore } from "@/store/useDoctorStore";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { s, vs } from "@/utils/styling";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import DoctorDetailsCard from "@/components/ui/DoctorDetailsCard";
import DoctorStatsCard from "@/components/ui/DoctorStatsCard";
import { AvailabilityRule } from "@/types";
import {
  getDoctorAvailability,
  formatWorkingTime,
} from "@/services/availabilityService";
import { REVIEWS } from "@/constants/data";
import ReviewItem from "@/components/ui/ReviewItem";
import AppButton from "@/components/ui/AppButton";

// ─── Composant d'un avis patient ─────────────────────────────────────────────

// ─── Screen principal ─────────────────────────────────────────────────────────

const DoctorDetailsScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const doctor = useDoctorStore((state) =>
    state.doctors.find((d) => d.id === id),
  );

  const { toggle, favoriteIds } = useFavoriteStore();

  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [loadingRules, setLoadingRules] = useState(true);

  useEffect(() => {
    if (!id) return;
    getDoctorAvailability(id)
      .then(setRules)
      .catch(() => setRules([]))
      .finally(() => setLoadingRules(false));
  }, [id]);

  if (!doctor) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text
          style={{ fontSize: s(16) }}
          className="font-urbanist-bold text-greyscale-900"
        >
          Médecin introuvable.
        </Text>
      </View>
    );
  }

  const workingTime = loadingRules ? "Loading..." : formatWorkingTime(rules);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }} className="bg-white dark:bg-dark-1">
        {/* En-tête fixe */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: s(24),
            paddingTop: vs(24),
            paddingBottom: vs(12),
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

            <Text
              style={{ fontSize: s(22) }}
              className="font-urbanist-bold text-greyscale-900"
            >
              {doctor.full_name}
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

        {/* Contenu scrollable */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: s(24),
            paddingTop: vs(8),
            paddingBottom: vs(120),
            backgroundColor: "transparent",
            gap: vs(24),
          }}
        >
          {/* Carte médecin */}
          <DoctorDetailsCard
            doctor={doctor}
            isFavorite={favoriteIds.has(doctor.id)}
            onFavoritePress={() => toggle(doctor)}
          />

          {/* Stats */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: s(8),
            }}
          >
            <DoctorStatsCard
              icon={IMAGES.users_icon}
              title="patients"
              value={`${doctor.patients_count}+`}
            />

            <DoctorStatsCard
              icon={IMAGES.activity_icon}
              title="years exp."
              value={`${doctor.experience_years}+`}
            />

            <DoctorStatsCard
              icon={IMAGES.star_icon}
              title="rating"
              value={doctor.rating}
            />

            <DoctorStatsCard
              icon={IMAGES.more_icon}
              title="reviews"
              value="4,942"
            />
          </View>

          {/* About me */}
          <View style={{ gap: vs(8) }}>
            <Text
              style={{ fontSize: s(20) }}
              className="font-urbanist-bold text-greyscale-900"
            >
              About me
            </Text>

            <Text
              style={{
                fontSize: s(14),
                letterSpacing: s(0.2),
                lineHeight: vs(22),
              }}
              className="font-urbanist-regular text-greyscale-700"
            >
              {doctor.bio}
            </Text>
          </View>

          {/* Working Time */}
          <View style={{ gap: vs(8) }}>
            <Text
              style={{ fontSize: s(20) }}
              className="font-urbanist-bold text-greyscale-900"
            >
              Working Time
            </Text>

            {loadingRules ? (
              <ActivityIndicator size="small" color="#246BFD" />
            ) : (
              <Text
                style={{ fontSize: s(14), letterSpacing: s(0.2) }}
                className="font-urbanist-regular text-greyscale-700"
              >
                {workingTime}
              </Text>
            )}
          </View>

          {/* Reviews */}
          <View style={{ gap: vs(16) }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ fontSize: s(20) }}
                className="font-urbanist-bold text-greyscale-900"
              >
                Reviews
              </Text>

              <Pressable
                hitSlop={12}
                onPress={() =>
                  router.push({
                    pathname: "/(home)/doctor/all_reviews",
                    params: { rating: doctor.rating },
                  })
                }
              >
                <Text
                  style={{ fontSize: s(16) }}
                  className="font-urbanist-bold text-primary-500"
                >
                  See All
                </Text>
              </Pressable>
            </View>

            {/* Liste statique des 5 premiers avis */}
            <View style={{ gap: vs(16) }}>
              {REVIEWS.slice(0, 3).map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: s(24),
            paddingVertical: vs(24),
            backgroundColor: "#FFFFFFF",
          }}
        >
          <AppButton
            title="Book Appointment"
            className="bg-main-primary shadow-md"
            onPress={() =>
              router.push({
                pathname: "/(home)/appointment/book_appointment",
                params: { doctorId: doctor.id },
              })
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DoctorDetailsScreen;
