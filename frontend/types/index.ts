import { ImageSourcePropType } from "react-native";

export type User = {
  id: string;
  email: string;
  role: "patient" | "doctor";
};

export interface TabBarIconProps {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}
