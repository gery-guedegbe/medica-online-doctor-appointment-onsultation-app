import React, { useState } from "react";
import { s, vs } from "@/utils/styling";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IMAGES } from "@/constants/images";
import { COLORS } from "@/constants/colors";
import AppInput from "@/components/ui/AppInput";
import AppButton from "@/components/ui/AppButton";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  FillProfileFormData,
  fillProfileSchema,
  dateToISO,
} from "@/schemas/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/auth.store";
import { api } from "@services/api";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

// Affiche "MM/DD/YYYY" depuis la valeur ISO "YYYY-MM-DD"
const formatDisplayDate = (iso: string): string => {
  if (!iso || iso.length < 10) return "";
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
};

const GENDER_OPTIONS = [
  { label: "Male", value: "male" as const },
  { label: "Female", value: "female" as const },
  { label: "Other", value: "other" as const },
];

const FillYourProfile = () => {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  // Avatar
  const [avatarUri, setAvatarUri] = useState<string | null>(
    user?.avatar_url || null,
  );
  const [avatarChanged, setAvatarChanged] = useState(false);

  // Date picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState<Date>(new Date(1990, 0, 1));

  // Gender modal
  const [showGenderModal, setShowGenderModal] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FillProfileFormData>({
    resolver: zodResolver(fillProfileSchema),
    defaultValues: {
      full_name: user?.full_name ?? "",
      nickname: user?.nickname ?? "",
      date_of_birth: user?.date_of_birth ?? "",
      gender: undefined,
    },
  });

  const dateOfBirth = watch("date_of_birth");
  const selectedGender = watch("gender");

  // ── Avatar ────────────────────────────────────────────────
  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission refusée",
        "Autorisez l'accès à votre galerie dans les paramètres.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
      setAvatarChanged(true);
    }
  };

  // ── Date picker ──────────────────────────────────────────
  const onDateChange = (_: unknown, date?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (date) {
      setPickerDate(date);
      if (Platform.OS === "android") {
        setValue("date_of_birth", dateToISO(date), { shouldValidate: true });
      }
    }
  };

  const confirmDate = () => {
    setValue("date_of_birth", dateToISO(pickerDate), { shouldValidate: true });
    setShowDatePicker(false);
  };

  // ── Gender ───────────────────────────────────────────────
  const handleGenderSelect = (value: "male" | "female" | "other") => {
    setValue("gender", value, { shouldValidate: true });
    setShowGenderModal(false);
  };

  const genderLabel =
    GENDER_OPTIONS.find((o) => o.value === selectedGender)?.label ?? "";

  // ── Submit ────────────────────────────────────────────────
  const onSubmit = async (data: FillProfileFormData) => {
    try {
      // 1. Upload avatar si l'user en a sélectionné un
      if (avatarChanged && avatarUri) {
        const formData = new FormData();
        const filename = avatarUri.split("/").pop() ?? "avatar.jpg";
        const ext = filename.split(".").pop() ?? "jpg";

        formData.append("avatar", {
          uri: avatarUri,
          name: filename,
          type: `image/${ext}`,
        } as any);

        await api.post("/users/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // 2. Mise à jour du profil
      const payload: Record<string, string> = {
        full_name: data.full_name,
        nickname: data.nickname,
      };
      if (data.date_of_birth) payload.date_of_birth = data.date_of_birth;
      if (data.gender) payload.gender = data.gender;

      const response = await api.patch("/users/profile", payload);

      // 3. Mise à jour du store (profile_complete deviendra true)
      setUser(response.data.data.user, response.data.data.profile_complete);

      // 4. Navigation vers l'écran de création du PIN
      router.replace("/(auth)/create_new_pin");
    } catch (error: any) {
      const code = error?.response?.data?.error?.code;
      if (code === "NICKNAME_TAKEN") {
        setError("nickname", { message: "Ce nickname est déjà utilisé" });
      } else {
        Alert.alert(
          "Erreur",
          "Impossible de sauvegarder votre profil, réessayez.",
        );
      }
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="flex-1 bg-white dark:bg-dark-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            paddingHorizontal: s(24),
            paddingTop: vs(24),
            paddingBottom: vs(48),
            gap: vs(32),
          }}
        >
          {/* Titre */}
          <Text
            style={{ fontSize: s(24) }}
            className="text-left font-urbanist-bold text-greyscale-900"
          >
            Fill Your Profile
          </Text>

          {/* Avatar */}
          <View style={{ alignSelf: "center" }}>
            <Image
              source={
                avatarUri ? { uri: avatarUri } : IMAGES.default_user_profil
              }
              resizeMode="cover"
              style={{
                width: s(200),
                height: s(200),
                borderRadius: s(70),
              }}
            />
            <Pressable
              onPress={handlePickAvatar}
              style={{
                width: s(41),
                height: s(41),
                position: "absolute",
                bottom: 0,
                right: 0,
              }}
            >
              <Image
                source={IMAGES.edit_icon}
                resizeMode="contain"
                style={{ flex: 1 }}
              />
            </Pressable>
          </View>

          {/* Full Name */}
          <Controller
            control={control}
            name="full_name"
            render={({ field: { value, onChange } }) => (
              <AppInput
                value={value}
                onChangeText={onChange}
                placeholder="Full Name"
                error={errors.full_name?.message}
              />
            )}
          />

          {/* Nickname */}
          <Controller
            control={control}
            name="nickname"
            render={({ field: { value, onChange } }) => (
              <AppInput
                value={value}
                onChangeText={onChange}
                placeholder="Nickname"
                error={errors.nickname?.message}
              />
            )}
          />

          {/* Email — lecture seule, non soumis */}
          <AppInput
            value={user?.email ?? ""}
            onChangeText={() => {}}
            placeholder="Email"
            desIcon={true}
            icon={IMAGES.message_thin_icon}
          />

          {/* Date of Birth — ouvre le picker */}
          <Pressable onPress={() => setShowDatePicker(true)}>
            <View pointerEvents="none">
              <AppInput
                value={formatDisplayDate(dateOfBirth ?? "")}
                onChangeText={() => {}}
                placeholder="Date of Birth"
                desIcon={true}
                icon={IMAGES.calendar_icon}
                error={errors.date_of_birth?.message}
              />
            </View>
          </Pressable>

          {/* Gender — ouvre la modal */}
          <Pressable onPress={() => setShowGenderModal(true)}>
            <View pointerEvents="none">
              <AppInput
                value={genderLabel}
                onChangeText={() => {}}
                placeholder="Gender"
                desIcon={true}
                icon={IMAGES.arrow_down_icon}
                error={errors.gender?.message}
              />
            </View>
          </Pressable>

          {/* Bouton Continue */}
          <View style={{ paddingTop: vs(24) }}>
            <AppButton
              title="Continue"
              loading={isSubmitting}
              className="bg-main-primary shadow-md"
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </ScrollView>

      {/* ── Date Picker iOS — modal bottom sheet ──────────── */}
      {Platform.OS === "ios" && (
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <Pressable
            className="flex-1"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onPress={() => setShowDatePicker(false)}
          />
          <View
            className="bg-white"
            style={{
              borderTopLeftRadius: s(24),
              borderTopRightRadius: s(24),
              padding: s(20),
            }}
          >
            {/* Boutons header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: vs(8),
              }}
            >
              <Pressable hitSlop={12} onPress={() => setShowDatePicker(false)}>
                <Text
                  style={{ fontSize: s(16) }}
                  className="font-urbanist-semibold text-greyscale-500"
                >
                  Annuler
                </Text>
              </Pressable>
              <Pressable hitSlop={12} onPress={confirmDate}>
                <Text
                  style={{ fontSize: s(16) }}
                  className="font-urbanist-bold text-main-primary"
                >
                  Confirmer
                </Text>
              </Pressable>
            </View>

            <DateTimePicker
              value={pickerDate}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              onChange={onDateChange}
              style={{ height: vs(200) }}
            />
          </View>
        </Modal>
      )}

      {/* ── Date Picker Android — natif ───────────────────── */}
      {Platform.OS === "android" && showDatePicker && (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display="default"
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
          onChange={onDateChange}
        />
      )}

      {/* ── Gender Modal ──────────────────────────────────── */}
      <Modal
        visible={showGenderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <Pressable
          className="flex-1"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onPress={() => setShowGenderModal(false)}
        />
        <View
          className="bg-white"
          style={{
            borderTopLeftRadius: s(24),
            borderTopRightRadius: s(24),
            padding: s(24),
            gap: vs(12),
          }}
        >
          <Text
            style={{ fontSize: s(18), marginBottom: vs(4) }}
            className="text-center font-urbanist-bold text-greyscale-900"
          >
            Select Gender
          </Text>

          {GENDER_OPTIONS.map((option) => {
            const isSelected = selectedGender === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => handleGenderSelect(option.value)}
                style={{
                  height: vs(56),
                  borderRadius: s(12),
                  paddingHorizontal: s(20),
                  justifyContent: "center",
                  backgroundColor: isSelected
                    ? COLORS.primary[100]
                    : COLORS.greyscale[50],
                  borderWidth: isSelected ? 1.5 : 0,
                  borderColor: isSelected ? COLORS.main.primary : "transparent",
                }}
              >
                <Text
                  style={{ fontSize: s(16) }}
                  className={`font-urbanist-semibold ${isSelected ? "text-main-primary" : "text-greyscale-900"}`}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}

          <Pressable
            hitSlop={12}
            onPress={() => setShowGenderModal(false)}
            style={{ paddingTop: vs(4) }}
          >
            <Text
              style={{ fontSize: s(16) }}
              className="text-center font-urbanist-semibold text-greyscale-500"
            >
              Cancel
            </Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FillYourProfile;
