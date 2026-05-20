import { Doctor } from "@/types";
import { IMAGES } from "./images";

export const WALKTHROUT_ITEMS = [
  {
    id: "1",
    img: IMAGES.walkthrought_image_1,
    text: "Thousands of doctors & experts to help your health!",
  },
  {
    id: "2",
    img: IMAGES.walkthrought_image_2,
    text: "Health checks & consultations easily anywhere anytime",
  },
  {
    id: "3",
    img: IMAGES.walkthrought_image_3,
    text: "Let's start living healthy and well with us right now!",
  },
];

export const DOCTORS: Doctor[] = [
  {
    id: "1",
    name: "Dr. Travis Westaby",
    specialty: "Cardiologists",
    hospital: "Alka Hospital",
    rating: 4.3,
    reviews: 5376,
    image: IMAGES.doctor_image,
    isFavorite: true,
    category: "General",
  },
  {
    id: "2",
    name: "Dr. Nathaniel Valle",
    specialty: "Cardiologists",
    hospital: "B&B Hospital",
    rating: 4.6,
    reviews: 3837,
    image: IMAGES.doctor_image,
    isFavorite: true,
    category: "Dentist",
  },
  {
    id: "3",
    name: "Dr. Beckett Calger",
    specialty: "Cardiologists",
    hospital: "Venus Hospital",
    rating: 4.4,
    reviews: 4942,
    image: IMAGES.doctor_image,
    isFavorite: false,
    category: "Nutritionist",
  },
];
