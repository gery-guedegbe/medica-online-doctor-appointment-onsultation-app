import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { s, vs } from "@utils/styling";
import { COLORS } from "@constants/colors";
import AppButton from "@components/ui/AppButton";
import { supabase } from "@config/supabase";

const OTP_LENGTH = 8;
const RESEND_DELAY = 60;
const BOX_GAP = s(6);

const OtpVerificationScreen = () => {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_DELAY);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Largeur dynamique : les 8 boites rentrent sans overflow quelle que soit la taille d'ecran
  const horizontalPadding = s(24) * 2;
  const totalGaps = (OTP_LENGTH - 1) * BOX_GAP;
  const boxWidth = Math.floor(
    (screenWidth - horizontalPadding - totalGaps) / OTP_LENGTH,
  );
  const boxHeight = vs(52);

  useEffect(() => {
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 150);
    startCountdown();
    return () => {
      clearTimeout(focusTimer);
      clearInterval(intervalRef.current!);
    };
  }, []);

  const startCountdown = () => {
    setCountdown(RESEND_DELAY);
    intervalRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleVerify = async () => {
    if (otp.length < OTP_LENGTH) return;
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email: email ?? "",
      token: otp,
      type: "recovery",
    });

    setLoading(false);

    if (error) {
      Alert.alert(
        "Code invalide",
        "Le code est incorrect ou expiré. Réessayez.",
      );
      setOtp("");
      return;
    }

    router.replace("/(auth)/create_new_password" as any);
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email ?? "");
    if (error) {
      Alert.alert("Erreur", "Impossible de renvoyer le code.");
      return;
    }
    setOtp("");
    startCountdown();
  };

  const maskEmail = (e: string) => {
    const [name, domain] = (e ?? "").split("@");
    if (!name || !domain) return e;
    return (
      name.slice(0, 2) + "*".repeat(Math.max(0, name.length - 2)) + "@" + domain
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-dark-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={{
            paddingHorizontal: s(24),
            paddingTop: vs(24),
            paddingBottom: vs(48),
            gap: vs(32),
            flex: 1,
          }}
          className="justify-between"
        >
          <Text
            style={{ fontSize: s(24) }}
            className="font-urbanist-bold text-greyscale-900"
          >
            OTP Code Verification
          </Text>

          <View style={{ gap: vs(32) }}>
            <Text
              style={{ fontSize: s(14), lineHeight: s(22) }}
              className="font-urbanist-regular text-greyscale-500"
            >
              {"Code has been sent to "}
              <Text className="font-urbanist-bold text-greyscale-900">
                {maskEmail(email ?? "")}
              </Text>
            </Text>

            {/* Zone OTP :
                - Les boites sont l'affichage visuel
                - Le TextInput recouvre toute la zone (position absolute, full coverage)
                  => tap direct sur la zone = clavier natif s'ouvre */}
            <View style={{ position: "relative" }}>
              {/* Boites d'affichage */}
              <View
                style={{
                  flexDirection: "row",
                  gap: BOX_GAP,
                  justifyContent: "center",
                }}
              >
                {Array.from({ length: OTP_LENGTH }).map((_, i) => {
                  const isFilled = i < otp.length;
                  const isActive = i === otp.length;
                  return (
                    <View
                      key={i}
                      style={{
                        width: boxWidth,
                        height: boxHeight,
                        borderRadius: s(8),
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: isActive ? 2 : 1,
                        borderColor: isActive
                          ? COLORS.main.primary
                          : isFilled
                            ? COLORS.greyscale[300]
                            : COLORS.greyscale[200],
                        backgroundColor: isFilled
                          ? COLORS.primary[100]
                          : "transparent",
                      }}
                    >
                      {isFilled && (
                        <Text
                          style={{ fontSize: s(18) }}
                          className="font-urbanist-bold text-main-primary"
                        >
                          {otp[i]}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* TextInput invisible sur toute la zone OTP.
                  color + backgroundColor transparent = invisible.
                  caretHidden = pas de curseur visible.
                  Toujours focusable au tap car couvre toute la surface. */}
              <TextInput
                ref={inputRef}
                value={otp}
                onChangeText={(text) =>
                  setOtp(text.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH))
                }
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                caretHidden
                style={{
                  position: "absolute",
                  opacity: 0,
                  width: 1,
                  height: 1,
                }}
              />
            </View>

            {/* Renvoi du code */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: s(4),
              }}
            >
              <Text
                style={{ fontSize: s(14) }}
                className="font-urbanist-regular text-greyscale-500"
              >
                {"Resend code in "}
              </Text>
              {countdown > 0 ? (
                <Text
                  style={{ fontSize: s(14) }}
                  className="font-urbanist-bold text-main-primary"
                >
                  {countdown}s
                </Text>
              ) : (
                <Pressable hitSlop={8} onPress={handleResend}>
                  <Text
                    style={{ fontSize: s(14) }}
                    className="font-urbanist-bold text-main-primary"
                  >
                    Resend
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          <AppButton
            title="Verify"
            loading={loading}
            disabled={otp.length < OTP_LENGTH}
            className="bg-main-primary shadow-md"
            onPress={handleVerify}
            style={{ opacity: otp.length < OTP_LENGTH ? 0.5 : 1 }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpVerificationScreen;
