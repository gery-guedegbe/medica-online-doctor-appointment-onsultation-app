import {
  FlatList,
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import { s, vs } from "@/utils/styling";
import { useRouter } from "expo-router";
import { IMAGES } from "@/constants/images";

const NUM_COLUMNS = 4;

const DoctorSpeciality = () => {
  const router = useRouter();

  const { width } = useWindowDimensions();

  // Largeur d'un item = (largeur écran - padding horizontal - gaps entre colonnes) / nb colonnes
  const HORIZONTAL_PADDING = s(24) * 2;
  const GAP = s(24);
  const itemWidth =
    (width - HORIZONTAL_PADDING - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

  const doctorSpecialities = [
    { id: "1", name: "Generalist", icon: IMAGES.generalist_icon },
    { id: "2", name: "Dentist", icon: IMAGES.dentist_icon },
    { id: "3", name: "Ophthalmologist", icon: IMAGES.ophthal_icon },
    { id: "4", name: "Nutritionist", icon: IMAGES.nutrition_icon },
    { id: "5", name: "Neurologist", icon: IMAGES.neurolo_icon },
    { id: "6", name: "Pediatrician", icon: IMAGES.pediatric_icon },
    { id: "7", name: "Radiologist", icon: IMAGES.radiolo_icon },
    { id: "8", name: "More", icon: IMAGES.more_icon },
  ];

  return (
    <View style={{ gap: vs(32) }}>
      <View className="flex flex-row items-center justify-between">
        <Text
          style={{ fontSize: s(20) }}
          className="textgreyscale-900 font-urbanist-bold"
        >
          Doctor Speciality
        </Text>

        <Pressable
          hitSlop={16}
          onPress={() => router.push("/(home)/top_doctor")}
        >
          <Text
            style={{ fontSize: s(16), letterSpacing: s(0.2) }}
            className="font-urbanist-bold text-primary-500"
          >
            See All
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={doctorSpecialities}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{ gap: vs(24) }}
        renderItem={({ item }) => (
          <Pressable
            key={item.id}
            style={{ width: itemWidth, alignItems: "center", gap: vs(8) }}
          >
            <View
              style={{ flex: 1, gap: vs(12) }}
              className="flex flex-wrap items-center justify-center"
            >
              <View
                style={{
                  width: s(60),
                  height: s(60),
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: s(50),
                }}
                className="bg-transparent-blue/10"
              >
                <Image
                  resizeMode="contain"
                  source={item.icon}
                  style={{ width: s(24), height: s(24) }}
                />
              </View>

              <Text
                style={{
                  width: itemWidth,
                  fontSize: s(16),
                  letterSpacing: s(0.2),
                }}
                numberOfLines={1}
                className="truncate text-center font-urbanist-bold text-gray-800"
              >
                {item.name}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default DoctorSpeciality;
