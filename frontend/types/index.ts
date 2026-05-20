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

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviews: number;
  image: any;
  isFavorite?: boolean;
  category: string; // "All" | "General" | "Dentist" | "Nutritionist" | ...
}
