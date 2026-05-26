import React from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

const BookConfirmationScreen = () => {
  const { doctorId, date, slotStart, slotEnd } =
    useLocalSearchParams<{
      doctorId: string;
      date: string;
      slotStart: string;
      slotEnd: string;
    }>();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>BookConfirmationScreen</Text>
    </View>
  );
};

export default BookConfirmationScreen;
