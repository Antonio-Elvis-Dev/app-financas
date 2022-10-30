import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import SingIn from "../pages/SingIn";

const AuthStack = createStackNavigator();

export default function AuthRoutes() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="SingIn"
        component={SingIn}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
}
