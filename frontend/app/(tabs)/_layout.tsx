import React from "react";
import { Tabs } from "expo-router";
import { s, vs } from "@/utils/styling";
import { TabBarIconProps } from "@/types";
import { Image, Text, View } from "react-native";
import { IMAGES } from "@/constants/images";

const TabsLayout = () => {
  const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
    <View
      style={{ minWidth: s(58), minHeight: vs(38), gap: vs(2) }}
      className={`flex flex-col items-center justify-center`}
    >
      <Image
        source={icon}
        resizeMode="contain"
        style={{ width: s(24), height: vs(24) }}
        tintColor={focused ? "#246BFD" : "#9E9E9E"}
      />

      <Text
        numberOfLines={1}
        style={{ fontSize: s(10), letterSpacing: s(0.2) }}
        className={`text-center font-urbanist-bold ${focused ? "text-primary-500" : "text-gray-500"}`}
      >
        {title}
      </Text>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: vs(90),
          //   paddingHorizontal: s(32),
          backgroundColor: "#FFFFFF",
        },
        tabBarItemStyle: {
          marginHorizontal: s(19),
          marginVertical: vs(19),
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="Home"
              icon={IMAGES.home_icon}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="appointments"
        options={{
          title: "Appointments",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="Appointments"
              icon={IMAGES.calendar_icon}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="History"
              icon={IMAGES.history_icon}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="articles"
        options={{
          title: "Articles",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="Articles"
              icon={IMAGES.articles_icon}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="Profile"
              icon={IMAGES.profile_icon}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
