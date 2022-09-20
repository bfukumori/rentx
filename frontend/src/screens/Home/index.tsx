import React, { useEffect } from "react";
import { StatusBar, LogBox } from "react-native";
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
import { RFValue } from "react-native-responsive-fontsize";

import { RootStackScreenProps } from "../../@types/navigation";

import Logo from "../../assets/logo.svg";

import { useCar } from "../../hooks/car";
import { useSync } from "../../hooks/sync";

import { Car } from "../../components/Car";
import { LoadingAnimation } from "../../components/LoadingAnimation";

import { CarList, Container, Header, HeaderContent, TotalCars } from "./styles";
import { Car as CarModel } from "../../database/models/Car";

export function Home({ navigation }: RootStackScreenProps<"Home">) {
  const { cars, loading } = useCar();
  const { isOnline, offlineSynchronize } = useSync();

  function handleCarDetails(car: CarModel) {
    navigation.navigate("CarDetails", {
      car,
    });
  }

  useEffect(() => {
    offlineSynchronize();
  }, [isOnline]);

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header>
        <HeaderContent>
          <Logo width={RFValue(108)} height={RFValue(12)} />
          {!loading && (
            <TotalCars>{`Total de ${cars.length} carros`}</TotalCars>
          )}
        </HeaderContent>
      </Header>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <CarList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Car data={item} onPress={() => handleCarDetails(item)} />
          )}
        />
      )}
    </Container>
  );
}
