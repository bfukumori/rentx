import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MarkedDatesProps } from "../components/Calendar";
import { CarDTO } from "../dtos/CarDTO";
import { UserDTO } from "../dtos/UserDTO";

export type RootStackParamList = {
  Home: undefined;
  CarDetails: { car: CarDTO };
  Scheduling: { car: CarDTO };
  SchedulingDetails: { car: CarDTO; dates: string[] };
  Confirmation: {
    title: string;
    message: string;
    nextScreenRoute: RootStackScreenProps;
  };
  MyCars: undefined;
  Splash: undefined;
  SignIn: undefined;
  FirstStep: undefined;
  SecondStep: { user: UserDTO };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
  MyCarsTab: undefined;
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
