import React, { useEffect, useState } from "react";
import { Alert, FlatList, StatusBar } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

import { useTheme } from "styled-components/native";
import { BackButton } from "../../components/BackButton";
import { Car } from "../../components/Car";
import { Loading } from "../../components/Loading";

import api from "../../services/api";

import {
  Container,
  Header,
  Subtitle,
  Title,
  Content,
  Appointments,
  AppointmentsTitle,
  AppointmentsQuantity,
  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate,
} from "./styles";
import { Car as CarModel } from "../../database/models/Car";
import { format, parseISO } from "date-fns";

interface CarProps {
  car: CarModel;
  user_id: string;
  id: string;
  start_date: string;
  end_date: string;
}

export function MyCars() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);

  const screenIsFocus = useIsFocused();
  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchCars() {
    try {
      const response = await api.get("rentals");
      setCars(response.data);
    } catch (error) {
      Alert.alert("Não foi possível carregar a lista de carros.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCars();
  }, [screenIsFocus]);
  return (
    <Container>
      <Header>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <BackButton color={colors.shape} onPress={handleGoBack} />
        <Title>
          Escolha uma{"\n"}
          data de início e{"\n"}
          fim do aluguel
        </Title>
        <Subtitle>Conforto, segurança e praticidade</Subtitle>
      </Header>
      {loading ? (
        <Loading />
      ) : (
        <Content>
          <Appointments>
            <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
            <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
          </Appointments>
          <FlatList
            data={cars}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CarWrapper>
                <Car data={item.car} />
                <CarFooter>
                  <CarFooterTitle>Período</CarFooterTitle>
                  <CarFooterPeriod>
                    <CarFooterDate>
                      {format(parseISO(item.start_date), "dd/MM/yyyy")}
                    </CarFooterDate>
                    <AntDesign
                      name="arrowright"
                      size={20}
                      color={colors.title}
                      style={{ marginHorizontal: 10 }}
                    />
                    <CarFooterDate>
                      {format(parseISO(item.end_date), "dd/MM/yyyy")}
                    </CarFooterDate>
                  </CarFooterPeriod>
                </CarFooter>
              </CarWrapper>
            )}
          />
        </Content>
      )}
    </Container>
  );
}
