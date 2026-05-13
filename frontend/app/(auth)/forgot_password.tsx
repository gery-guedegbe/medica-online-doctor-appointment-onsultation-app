import React from "react";
import {
  Alert,
  Image,
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
import * as Linking from "expo-linking";
import { useAuthStore } from "@/stores/auth.store";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/schemas/auth.schema";

const ForgotPasswordScreen = () => {
  const router = useRouter();

  const { user } = useAuthStore();

  const { height } = useWindowDimensions();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: user?.email },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const redirectTo = Linking.createURL("/auth/otp_verification");

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo,
    });

    if (error) {
      // Supabase retourne toujours succès même si l'email n'existe pas
      // (sécurité — évite l'énumération d'emails)
      if (error.message.includes("rate limit")) {
        setError("email", {
          message: "Trop de tentatives, réessayez plus tard",
        });
      } else {
        Alert.alert("Erreur", "Impossible d'envoyer le code, réessayez.");
      }
      return;
    }

    // Navigation vers l'écran OTP avec l'email en paramètre
    router.push({
      pathname: "/(auth)/otp_verification",
      params: { email: data.email },
    });
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
            height: height,
            paddingHorizontal: s(24),
            paddingTop: vs(24),
            paddingBottom: vs(48),
            gap: vs(32),
          }}
          className="flex flex-1 justify-between"
        >
          {/* Header */}
          <Text
            style={{ fontSize: s(24) }}
            className="text-left font-urbanist-bold text-greyscale-900"
          >
            Forgot Password
          </Text>

          <View style={{ gap: vs(32) }}>
            {/* Illustration */}
            <Image
              source={IMAGES.forgot_password_image}
              resizeMode="contain"
              style={{
                width: s(276),
                height: vs(250),
                alignSelf: "center",
              }}
            />

            <Text
              style={{ fontSize: s(18), letterSpacing: s(0.2) }}
              className="text-left font-urbanist-medium text-greyscale-900"
            >
              Select which contact details should we use to reset your password
            </Text>

            {/* Email input */}
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <AppInput
                  value={user?.email ?? ""}
                  onChangeText={onChange}
                  placeholder="Email"
                  keyboardType="email-address"
                  icon={IMAGES.message_icon}
                  hasIcon
                  error={errors.email?.message}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
