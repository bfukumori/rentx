import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../@types/navigation';
import { Confirmation } from '../screens/Confirmation';
import { Splash } from '../screens/Splash';
import { SignIn } from '../screens/SignIn';
import { FirstStep } from '../screens/SignUp/FirstStep';
import { SecondStep } from '../screens/SignUp/SecondStep';

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

export function AuthRoutes() {
  return (
    <Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
      <Screen name='Splash' component={Splash} />
      <Screen name='SignIn' component={SignIn} />
      <Screen name='FirstStep' component={FirstStep} />
      <Screen name='SecondStep' component={SecondStep} />
      {/* <Screen name="Confirmation" component={Confirmation} /> */}
    </Navigator>
  );
}
