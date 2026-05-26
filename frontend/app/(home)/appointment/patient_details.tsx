import React, { useState } from "react";
import { s, vs } from "@/utils/styling";
import { IMAGES } from "@/constants/images";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "@/components/ui/AppButton";
import AppDropDown, { DropDownOption } from "@/components/ui/AppDropDown";
import { useAuthStore } from "@/stores/auth.store";

// ── Options ───────────────────────────────────────────────────────────────────

const GENDER_OPTIONS: DropDownOption[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const AGE_OPTIONS: DropDownOption[] = Array.from({ length: 83 }, (_, i) => {
  const age = i + 18;
  return { label: `${age} years`, value: String(age) };
});

// ─── Screen ───────────────────────────────────────────────────────────────────

const PatientDetailsScreen = () => {
  const { doctorId, date, slotStart, slotEnd, PackageId } =
    useLocalSearchParams<{
      doctorId: string;
      date: string;
      slotEnd: string;
      slotStart: string;
      PackageId: string;
    }>();

  const router = useRouter();

  const { user } = useAuthStore();

  const [problem, setProblem] = useState("");
  const [age, setAge] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(user?.gender || null);

  const canProceed =
    gender !== null && age !== null && problem.trim().length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    router.push({
      pathname: "/(home)/appointment/payments",
      params: {
        doctorId,
        date,
        slotStart,
        slotEnd,
        PackageId,
        gender,
        age,
        patient_name: user?.full_name,
        problem_description: problem.trim(),
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingTop: vs(24),
          paddingBottom: vs(12),
          paddingHorizontal: s(24),
        }}
        className="bg-white dark:bg-dark-1"
      >
        {/* ── En-tête ── */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: s(16),
            marginBottom: vs(24),
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
            className="font-urbanist-bold text-greyscale-900 dark:text-white"
          >
            Patient Details
          </Text>
        </View>

        {/* ── Contenu scrollable ── */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: vs(24), paddingBottom: vs(120) }}
        >
          {/* Full Name */}
          <View style={{ gap: vs(20) }}>
            <Text
              style={{ fontSize: s(20) }}
              className="font-urbanist-bold text-greyscale-900 dark:text-white"
            >
              Full Name
            </Text>

            <View
              style={{
                height: vs(56),
                borderRadius: s(16),
                alignItems: "flex-start",
                justifyContent: "center",
                paddingHorizontal: s(20),
                backgroundColor: "#FAFAFA",
              }}
            >
              <Text
                style={{ fontSize: s(14), letterSpacing: s(0.2) }}
                className="font-urbanist-semibold text-greyscale-900"
              >
                {user?.full_name}
              </Text>
            </View>
          </View>

          {/* Gender */}
          <View style={{ gap: vs(20) }}>
            <Text
              style={{ fontSize: s(20) }}
              className="font-urbanist-bold text-greyscale-900 dark:text-white"
            >
              Gender
            </Text>

            <AppDropDown
              title="Gender"
              options={GENDER_OPTIONS}
              selectedValue={gender}
              onSelect={(opt) => setGender(opt.value)}
              placeholder="Select your gender"
            />
          </View>

          {/* Age */}
          <View style={{ gap: vs(20) }}>
            <Text
              style={{ fontSize: s(20) }}
              className="font-urbanist-bold text-greyscale-900 dark:text-white"
            >
              Your Age
            </Text>

            <AppDropDown
              title="Your Age"
              options={AGE_OPTIONS}
              selectedValue={age}
              onSelect={(opt) => setAge(opt.value)}
              placeholder="Select your age"
            />
          </View>

          {/* Write Your Problem */}
          <View style={{ gap: vs(20) }}>
            <Text
              style={{ fontSize: s(20) }}
              className="font-urbanist-bold text-greyscale-900 dark:text-white"
            >
              Write Your Problem
            </Text>

            <TextInput
              value={problem}
              onChangeText={setProblem}
              multiline
              textAlignVertical="top"
              placeholder="Describe your problem here..."
              placeholderTextColor="#9E9E9E"
              style={{
                fontSize: s(14),
                letterSpacing: s(0.2),
                borderRadius: s(16),
                paddingHorizontal: s(20),
                paddingVertical: vs(16),
                backgroundColor: "#FAFAFA",
                minHeight: vs(140),
                fontFamily: "Urbanist-SemiBold",
                color: "#212121",
              }}
            />
          </View>
        </ScrollView>

        {/* ── Bouton Next fixe ── */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: s(24),
            paddingVertical: vs(24),
            alignItems: "center",
          }}
          className="bg-white dark:bg-dark-1"
        >
          <AppButton
            title="Next"
            disabled={!canProceed}
            onPress={handleNext}
            className={canProceed ? "bg-primary-500" : "bg-greyscale-200"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PatientDetailsScreen;
