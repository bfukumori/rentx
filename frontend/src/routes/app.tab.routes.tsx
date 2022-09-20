import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";
import { useTheme } from "styled-components/native";

import { MyCars } from "../screens/MyCars";
import { StackRoutes } from "./app.stack.routes";
import { TabParamList } from "../@types/navigation";

import HomeSvg from "../assets/home.svg";
import CarSvg from "../assets/car_tab.svg";
import PeopleSvg from "../assets/people_tab.svg";
import { Profile } from "../screens/Profile";

const { Navigator, Screen } = createBottomTabNavigator<TabParamList>();

export function TabRoutes() {
  const { colors } = useTheme();

  return (
    <Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.main,
        tabBarInactiveTintColor: colors.text_detail,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingVertical: Platform.OS === "ios" ? 20 : 0,
          height: 78,
          backgroundColor: colors.background_primary,
        },
      }}
    >
      <Screen
        name="HomeTab"
        component={StackRoutes}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg width={24} height={24} color={color} />
          ),
        }}
      />
      <Screen
        name="MyCarsTab"
        component={MyCars}
        options={{
          tabBarIcon: ({ color }) => (
            <CarSvg width={24} height={24} color={color} />
          ),
        }}
      />
      <Screen
        name="ProfileTab"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <PeopleSvg width={24} height={24} color={color} />
          ),
        }}
      />
    </Navigator>
  );
}
