import React from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { s, vs } from "@utils/styling";
import { IMAGES } from "@constants/images";
import AppInput from "@components/ui/AppInput";
import AppButton from "@components/ui/AppButton";

import { supabase } from "@config/supabase";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/schemas/auth.schema";

const CreateNewPasswordScreen = () => {
  const router = useRouter();

  const { height } = useWindowDimensions();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    // À ce stade, Supabase a déjà créé une session via verifyOtp
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      if (error.message.includes("same password")) {
        setError("password", {
          message: "Le nouveau mot de passe doit être différent de l'ancien",
        });
      } else {
        Alert.alert(
          "Erreur",
          `Impossible de mettre à jour le mot de passe. ${error.message}`,
        );
      }
      return;
    }

    router.replace("/(auth)/congratulations");
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="bg-white dark:bg-dark-1"
      >
        <View
          style={{
            height: height,
            paddingHorizontal: s(24),
            paddingTop: vs(24),
            // paddingBottom: vs(48),
            gap: vs(32),
          }}
          className="flex flex-1 justify-between"
        >
          {/* Header */}
          <Text
            style={{ fontSize: s(24) }}
            className="text-left font-urbanist-bold text-greyscale-900"
          >
            Create New Password
          </Text>

          {/* Illustration */}
          <Image
            source={IMAGES.create_new_password_image}
            resizeMode="contain"
            style={{ width: s(329), height: vs(250), alignSelf: "center" }}
          />

          <Text
            style={{ fontSize: s(18), letterSpacing: s(0.2) }}
            className="text-left font-urbanist-medium text-greyscale-900"
          >
            Create Your New Password
          </Text>

          <View style={{ gap: vs(32) }}>
            {/* Nouveau mot de passe */}
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <AppInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="New Password"
                  secureTextEntry
                  hasIcon
                  icon={IMAGES.lock_icon}
                  error={errors.password?.message}
                />
              )}
            />

            {/* Confirmation */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { value, onChange } }) => (
                <AppInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Confirm New Password"
                  secureTextEntry
                  hasIcon
                  icon={IMAGES.lock_icon}
                  error={errors.confirmPassword?.message}
                />
              )}
            />
          </View>

          <AppButton
            title="Continue"
            loading={isSubmitting}
            className="bg-main-primary shadow-md"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateNewPasswordScreen;
