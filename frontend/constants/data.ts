import { Doctor } from "@/types";

import { IMAGES } from "@/constants/images";

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

// export const DOCTORS: Doctor[] = [
//   {
//     id: "1",
//     name: "Dr. Travis Westaby",
//     specialty: "Cardiologists",
//     hospital: "Alka Hospital",
//     rating: 4.3,
//     reviews: 5376,
//     image: IMAGES.doctor_image,
//     isFavorite: true,
//     category: "General",
//   },
//   {
//     id: "2",
//     name: "Dr. Nathaniel Valle",
//     specialty: "Cardiologists",
//     hospital: "B&B Hospital",
//     rating: 4.6,
//     reviews: 3837,
//     image: IMAGES.doctor_image,
//     isFavorite: true,
//     category: "Dentist",
//   },
//   {
//     id: "3",
//     name: "Dr. Beckett Calger",
//     specialty: "Cardiologists",
//     hospital: "Venus Hospital",
//     rating: 4.4,
//     reviews: 4942,
//     image: IMAGES.doctor_image,
//     isFavorite: false,
//     category: "Nutritionist",
//   },
// ];

// ─── Reviews ─────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  patient_name: string;
  avatar_url: string;
  stars: number;      // 1 à 5
  comment: string;
  likes: number;
  date: string;       // affichage libre ex: "6 days ago"
}

export const REVIEWS: Review[] = [
  {
    id: "1",
    patient_name: "Charolette Hanlin",
    avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
    stars: 5,
    comment: "Dr. Jenny is very professional in her work and responsive. I have consulted and my problem is solved. 😊😊",
    likes: 938,
    date: "6 days ago",
  },
  {
    id: "2",
    patient_name: "Darron Kulikowski",
    avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
    stars: 4,
    comment: "The doctor is very beautiful and the service is excellent! I like it and want to consult again 😍😍",
    likes: 863,
    date: "6 days ago",
  },
  {
    id: "3",
    patient_name: "Lauralee Quintero",
    avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
    stars: 4,
    comment: "Doctors who are very skilled and fast in service. I highly recommend Dr. Jenny for all who want to consult 👍👍",
    likes: 629,
    date: "1 week ago",
  },
  {
    id: "4",
    patient_name: "Aileen Fullbright",
    avatar_url: "https://randomuser.me/api/portraits/women/21.jpg",
    stars: 5,
    comment: "Doctors who are very skilled and fast in service. My illness is cured, thank you very much 😊",
    likes: 553,
    date: "1 week ago",
  },
  {
    id: "5",
    patient_name: "Rodolfo Goode",
    avatar_url: "https://randomuser.me/api/portraits/men/57.jpg",
    stars: 4,
    comment: "Dr. Jenny is very professional in her work and responsive. I have consulted and my problem is solved. 🔥🔥",
    likes: 471,
    date: "2 weeks ago",
  },
];

// ─── Notifications ────────────────────────────────────────────────────────────

// constants/notifications.ts

export interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  isNew?: boolean;
  icon: any;
  iconBackgroundColor: string;
}

export const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Appointment Cancelled!",
    description:
      "You have successfully canceled your appointment with Dr. Alan Watson on December 24, 2024, 13:00 pm. 80% of the funds will be returned to your account.",
    date: "Today",
    time: "15:36 PM",
    isNew: true,
    icon: IMAGES.cancel_icon,
    iconBackgroundColor: "#FFF5F5",
  },
  {
    id: "2",
    title: "Schedule Changed",
    description:
      "You have successfully changed schedule an appointment with Dr. Alan Watson on December 24, 2024, 13:00 pm. Don't forget to activate your reminder.",
    date: "Yesterday",
    time: "09:23 AM",
    isNew: true,
    icon: IMAGES.schedule_icon,
    iconBackgroundColor: "#F1FFF1",
  },
  {
    id: "3",
    title: "Appointment Success!",
    description:
      "You have successfully booked an appointment with Dr. Alan Watson on December 24, 2024, 10:00 am. Don't forget to activate your reminder.",
    date: "19 Dec, 2022",
    time: "18:35 PM",
    isNew: false,
    icon: IMAGES.appointment_icon, // icône calendrier bleu
    iconBackgroundColor: "#F0F6FF", // background bleu clair
  },
  {
    id: "4",
    title: "New Services Available!",
    description:
      "You can now make multiple doctoral appointments at once. You can also cancel your appointment.",
    date: "14 Dec, 2022",
    time: "10:52 AM",
    isNew: false,
    icon: IMAGES.services_icon, // icône cadeau/service orange
    iconBackgroundColor: "#FFF8ED", // background orange clair
  },
  {
    id: "5",
    title: "Credit Card Connected!",
    description:
      "Your credit card has been successfully linked with Medica. Enjoy our service.",
    date: "12 Dec, 2022",
    time: "15:38 PM",
    isNew: false,
    icon: IMAGES.credit_card_icon, // icône carte bleue
    iconBackgroundColor: "#F0F6FF", // background bleu clair
  },
];
