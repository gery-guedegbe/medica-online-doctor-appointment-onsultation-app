import { ScrollView, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateNewPinScreen = () => {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="flex-1 bg-white dark:bg-dark-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text>{"CreateNewPinScreen"}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateNewPinScreen;
