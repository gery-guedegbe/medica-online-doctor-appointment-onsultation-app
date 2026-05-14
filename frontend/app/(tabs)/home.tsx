import { View } from "react-native";
import { s, vs } from "@/utils/styling";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeScreenHeader from "@/components/home/HomeScreenHeader";
import AppSearchBar from "@/components/ui/AppSearchBar";

const HomeScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          paddingHorizontal: s(24),
          paddingTop: vs(24),
          paddingBottom: vs(48),
          gap: vs(32),
        }}
        className="flex-1 bg-white dark:bg-dark-1"
      >
        <HomeScreenHeader />

        <AppSearchBar />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
