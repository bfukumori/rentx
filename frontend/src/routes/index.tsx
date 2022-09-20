import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../hooks/auth";
import { TabRoutes } from "./app.tab.routes";
import { AuthRoutes } from "./auth.routes";
import { LoadingAnimation } from "../components/LoadingAnimation";

export function Routes() {
  const { user, loading } = useAuth();

  return loading ? (
    <LoadingAnimation />
  ) : (
    <NavigationContainer>
      {user.id ? <TabRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
