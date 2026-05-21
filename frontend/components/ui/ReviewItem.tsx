import { s, vs } from "@/utils/styling";
import { Review } from "@/constants/data";
import { IMAGES } from "@/constants/images";
import { Image, Text, View } from "react-native";

const ReviewItem = ({ review }: { review: Review }) => (
  <View style={{ gap: vs(20), borderRadius: s(12) }}>
    {/* En-tête : avatar + nom + étoiles */}
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: s(16) }}>
        <Image
          source={{ uri: review.avatar_url }}
          style={{ width: s(48), height: s(48), borderRadius: s(50) }}
          resizeMode="cover"
        />

        <Text
          style={{ fontSize: s(16), letterSpacing: s(0.2) }}
          className="font-urbanist-bold text-greyscale-900 dark:text-white"
        >
          {review.patient_name}
        </Text>
      </View>

      {/* Badge étoiles */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: s(8),
          paddingHorizontal: s(16),
          paddingVertical: vs(6),
          borderRadius: s(50),
          borderWidth: 2,
          borderColor: "#246BFD",
        }}
      >
        <Image
          source={IMAGES.star_icon}
          style={{ width: s(12), height: s(12) }}
          resizeMode="contain"
        />

        <Text
          style={{ fontSize: s(14), letterSpacing: s(0.2) }}
          className="font-urbanist-bold text-primary-500"
        >
          {review.stars}
        </Text>
      </View>
    </View>

    {/* Commentaire */}
    <Text
      style={{ fontSize: s(14), letterSpacing: s(0.2) }}
      className="font-urbanist-regular text-greyscale-900 dark:text-greyscale-300"
    >
      {review.comment}
    </Text>

    {/* Likes + date */}
    <View style={{ flexDirection: "row", alignItems: "center", gap: s(24) }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: s(8) }}>
        <Image
          source={IMAGES.bold_heart_icon}
          style={{ width: s(24), height: s(24) }}
          resizeMode="contain"
        />

        <Text
          style={{ fontSize: s(12), letterSpacing: s(0.2) }}
          className="font-urbanist-medium text-greyscale-900"
        >
          {review.likes.toLocaleString()}
        </Text>
      </View>

      <Text
        style={{ fontSize: s(12), letterSpacing: s(0.2) }}
        className="font-urbanist-medium text-greyscale-700"
      >
        {review.date}
      </Text>
    </View>
  </View>
);

export default ReviewItem;
