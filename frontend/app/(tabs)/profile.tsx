import React from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/config/supabase";
import { useDoctorStore } from "@/store/useDoctorStore";
import { useFavoriteStore } from "@/store/useFavoriteStore";

const ProfileScreen = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert("Déconnexion", "Confirmer la déconnexion ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Se déconnecter",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          // Réinitialiser les stores pour ne pas garder les données de la session précédente
          useDoctorStore.getState().reset();
          useFavoriteStore.getState().reset();
          router.replace("/(auth)/sign-in");
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Profile</Text>

      <Pressable
        onPress={handleSignOut}
        style={{
          backgroundColor: "#EF4444",
          paddingHorizontal: 32,
          paddingVertical: 12,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
          Se déconnecter
        </Text>
      </Pressable>
    </View>
  );
};

export default ProfileScreen;
