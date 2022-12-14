import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MarkedDatesProps } from '../components/Calendar';
import { Car } from '../database/models/Car';

import { UserDTO } from '../dtos/UserDTO';

export type RootStackParamList = {
  Home: undefined;
  CarDetails: { car: Car };
  Scheduling: { car: Car };
  SchedulingDetails: { car: Car; dates: string[] };
  Confirmation: {
    title: string;
    message: string;
    nextScreenRoute: RootStackScreenProps;
  };
  Splash: undefined;
  SignIn: undefined;
  FirstStep: undefined;
  SecondStep: { user: UserDTO };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabParamList = {
  Home: NavigatorScreenParams<RootStackParamList>;
  MyCars: undefined;
  Profile: undefined;
};

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
