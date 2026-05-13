import {
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
import { signInFormData, signInSchema } from "@/schemas/auth.schema";
import { useAuthStore } from "@stores/auth.store";
import { useAuthNavigation } from "@hooks/useAuthNavigation";

const SignInScreen = () => {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuthStore();
  const { navigateAfterAuth } = useAuthNavigation();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<signInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: signInFormData) => {
    try {
      await signIn(data.email, data.password);
      const { profileComplete } = useAuthStore.getState();
      navigateAfterAuth(profileComplete);
    } catch (error: any) {
      const msg: string = error?.message ?? "";
      if (msg.includes("Invalid login credentials")) {
        setError("password", { message: "Email ou mot de passe incorrect" });
      } else if (msg.includes("Email not confirmed")) {
        setError("email", { message: "Vérifiez votre email avant de continuer" });
      } else {
        setError("password", { message: "Erreur de connexion, réessayez" });
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
            paddingBottom: vs(48),
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
            {"Login to Your Account"}
          </Text>

          <View style={{ gap: vs(20) }}>
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <AppInput
                  value={value}
                  hasIcon={true}
                  placeholder="Email"
                  onChangeText={onChange}
                  icon={IMAGES.message_icon}
                  keyboardType="email-address"
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <AppInput
                  value={value}
                  hasIcon={true}
                  placeholder="Password"
                  onChangeText={onChange}
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
              title="Sign in"
              className="bg-main-primary shadow-md"
              loading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
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
              <Pressable hitSlop={16} onPress={() => router.push("/(auth)/forgot_password" as any)}>
                <Text
                  style={{ fontSize: s(16), letterSpacing: s(0.2) }}
                  className="text-primary-500 text-center font-urbanist-semibold"
                >
                  {"Forgot the password?"}
                </Text>
              </Pressable>
            </View>
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
              {"or continue with"}
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
              {"Don’t have an account?"}
            </Text>

            <Pressable
              hitSlop={18}
              onPress={() => router.push("/(auth)/sign-in")}
            >
              <Text
                style={{ fontSize: s(14), letterSpacing: s(0.2) }}
                className="text-center font-urbanist-bold text-main-primary"
              >
                {"Sign up"}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
