import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { s, vs } from "@/utils/styling";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/colors";
import { IMAGES } from "@/constants/images";
import AppInput from "@/components/ui/AppInput";
import Checkbox from "@/components/ui/Checkbox";
import AppButton from "@/components/ui/AppButton";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaView } from "react-native-safe-area-context";
import { signUpFormData, signUpSchema } from "@/schemas/auth.schema";
import { useAuthStore } from "@stores/auth.store";
import { useAuthNavigation } from "@hooks/useAuthNavigation";

const SignUpScreen = () => {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuthStore();
  const { navigateAfterAuth } = useAuthNavigation();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<signUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: signUpFormData) => {
    try {
      const { needsVerification } = await signUp(data.email, data.password);

      if (needsVerification) {
        Alert.alert(
          "Vérifiez votre email",
          "Un lien de confirmation a été envoyé à " + data.email + ". Cliquez dessus pour activer votre compte.",
          [{ text: "OK", onPress: () => router.replace("/(auth)/let_you_in") }],
        );
      } else {
        // Email confirm désactivé (dev) → session directe
        const { profileComplete } = useAuthStore.getState();
        navigateAfterAuth(profileComplete);
      }
    } catch (error: any) {
      const msg: string = error?.message ?? "";
      if (msg === "EMAIL_ALREADY_EXISTS" || msg.includes("already registered")) {
        setError("email", { message: "Cet email est déjà utilisé" });
      } else {
        setError("email", { message: "Erreur lors de l'inscription, réessayez" });
      }
    }
  };

  const onGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      const { profileComplete } = useAuthStore.getState();
      navigateAfterAuth(profileComplete);
    } catch (error: any) {
      if (error?.message !== "GOOGLE_OAUTH_CANCELLED") {
        setError("email", { message: "Connexion Google échouée, réessayez" });
      }
    }
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
            paddingHorizontal: s(24),
            paddingTop: vs(24),
            // paddingBottom: vs(48),
            gap: vs(32),
          }}
          className="flex-1 items-center justify-center"
        >
          <Image
            source={IMAGES.sign_up_icon}
            style={{ width: s(140), height: vs(140) }}
            resizeMode="contain"
          />

          <Text
            style={{ fontSize: s(32) }}
            className="text-center font-urbanist-bold text-greyscale-900"
          >
            {"Create New Account"}
          </Text>

          <View style={{ gap: vs(20) }}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <AppInput
                  value={value}
                  onChangeText={onChange}
                  hasIcon={true}
                  placeholder="Email"
                  icon={IMAGES.message_icon}
                  error={errors.email?.message}
                  keyboardType="email-address"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <AppInput
                  value={value}
                  onChangeText={onChange}
                  hasIcon={true}
                  placeholder="Password"
                  icon={IMAGES.lock_icon}
                  secureTextEntry={true}
                  error={errors.password?.message}
                />
              )}
            />

            <View
              style={{
                width: s(380),
                height: vs(24),
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: vs(12),
              }}
            >
              <Controller
                control={control}
                name="rememberMe"
                render={({ field: { value, onChange } }) => (
                  <Checkbox
                    label="Remember me"
                    checked={value}
                    onChange={onChange}
                  />
                )}
              />
            </View>

            <AppButton
              title="Sign up"
              className="bg-main-primary shadow-md"
              onPress={handleSubmit(onSubmit)}
            />
          </View>

          <View
            style={{
              width: s(380),
              flexDirection: "row",
              alignItems: "center",
              gap: s(16),
            }}
          >
            <View
              style={{
                flex: 1,
                height: StyleSheet.hairlineWidth,
                backgroundColor: COLORS.greyscale[200],
              }}
            />

            <Text
              style={{ fontSize: s(18), letterSpacing: s(0.2) }}
              className="font-urbanist-semibold text-greyscale-500"
            >
              or continue with
            </Text>

            <View
              style={{
                flex: 1,
                height: StyleSheet.hairlineWidth,
                backgroundColor: COLORS.greyscale[200],
              }}
            />
          </View>

          <Pressable
            onPress={onGoogleSignIn}
            style={{
              width: s(87),
              height: vs(60),
              paddingHorizontal: s(32),
              borderRadius: s(16),
              borderWidth: 1,
              borderColor: COLORS.greyscale[200],
              gap: s(10),
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={IMAGES.google_icon}
              style={{ width: s(24), height: s(24) }}
              resizeMode="contain"
            />
          </Pressable>

          <View
            style={{
              width: s(380),
              height: vs(20),
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: s(8),
            }}
            className=""
          >
            <Text
              style={{ fontSize: s(14), letterSpacing: s(0.2) }}
              className="text-center font-urbanist-regular text-greyscale-500"
            >
              Already have an account?
            </Text>

            <Pressable
              hitSlop={18}
              onPress={() => router.push("/(auth)/sign-in")}
            >
              <Text
                style={{ fontSize: s(14), letterSpacing: s(0.2) }}
                className="text-center font-urbanist-bold text-main-primary"
              >
                Sign in
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
