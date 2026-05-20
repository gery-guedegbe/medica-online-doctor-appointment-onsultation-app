import { s, vs } from "@/utils/styling";
import { ScrollView, View } from "react-native";
import TopDoctors from "@/components/home/TopDoctors";
import AppSearchBar from "@/components/ui/AppSearchBar";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeScreenHeader from "@/components/home/HomeScreenHeader";
import DoctorSpeciality from "@/components/home/DoctorSpeciality";
import MedicalChecksBanner from "@/components/home/MedicalChecksBanner";

const HomeScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} className="bg-white dark:bg-dark-1">
        <View
          style={{
            paddingHorizontal: s(24),
            paddingTop: vs(24),
            paddingBottom: vs(48),
            gap: vs(32),
          }}
          className="flex-1"
        >
          <HomeScreenHeader />

          <AppSearchBar isPressable={true} />

          <MedicalChecksBanner />

          <DoctorSpeciality />

          <TopDoctors />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
