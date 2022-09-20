import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { format } from "date-fns";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";

import { Accessory } from "../../components/Accessory";
import { BackButton } from "../../components/BackButton";
import { ImageSlider } from "../../components/ImageSlider";
import { Button } from "../../components/Button";

import { RootStackScreenProps } from "../../@types/navigation";

import { getAccessoryIcon } from "../../utils/getAccessoryIcon";
import { getPlatformDate } from "../../utils/getPlatformDate";

import api from "../../services/api";

import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  Accessories,
  Footer,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalPriceTotal,
} from "./styles";
import { useSync } from "../../hooks/sync";
import { CarDTO } from "../../dtos/CarDTO";

interface RentalPeriod {
  start: string;
  end: string;
}

export function SchedulingDetails({
  navigation,
  route,
}: RootStackScreenProps<"SchedulingDetails">) {
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>(
    {} as RentalPeriod
  );
  const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();
  const { car, dates } = route.params;
  const { isOnline } = useSync();

  const rentalTotal = Number(dates.length * car.price);

  async function handleConfirmRental() {
    try {
      setIsLoading(true);
      await api.post("/rentals", {
        user_id: 1,
        car_id: car.id,
        start_date: new Date(dates[0]),
        end_date: new Date(dates[dates.length - 1]),
        total: rentalTotal,
      });
      navigation.navigate("Confirmation", {
        title: "Carro alugado!",
        message:
          "Agora você só precisa ir\n até a concessionária da RENTX\npegar o seu automóvel.",
        nextScreenRoute: "MyCars",
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível confirmar o agendamento.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchCarUpdated() {
    const response = await api.get(`cars/${car.id}`);
    setCarUpdated(response.data);
  }

  useEffect(() => {
    setRentalPeriod({
      start: format(getPlatformDate(new Date(dates[0])), "dd/MM/yyyy"),
      end: format(
        getPlatformDate(new Date(dates[dates.length - 1])),
        "dd/MM/yyyy"
      ),
    });
  }, []);

  useEffect(() => {
    if (isOnline) {
      fetchCarUpdated();
    }
  }, [isOnline]);

  return (
    <Container>
      <Header>
        <BackButton onPress={handleGoBack} />
      </Header>
      <CarImages>
        <ImageSlider
          imagesUrl={
            !!carUpdated.photos
              ? carUpdated.photos
              : [{ id: car.thumbnail, photo: car.thumbnail }]
          }
        />
      </CarImages>
      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>
          <Rent>
            <Period>{car.period}</Period>
            <Price>{`R$ ${car.price}`}</Price>
          </Rent>
        </Details>
        {carUpdated.accessories && (
          <Accessories>
            {carUpdated.accessories.map((accessory) => (
              <Accessory
                key={accessory.type}
                name={accessory.name}
                icon={getAccessoryIcon(accessory.type)}
              />
            ))}
          </Accessories>
        )}

        <RentalPeriod>
          <CalendarIcon>
            <Feather name="calendar" size={24} color={colors.shape} />
          </CalendarIcon>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.start}</DateValue>
          </DateInfo>
          <Feather name="chevron-right" size={10} color={colors.text} />
          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue>{rentalPeriod.end}</DateValue>
          </DateInfo>
        </RentalPeriod>
        <RentalPrice>
          <RentalPriceLabel>TOTAL</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>{`R$ ${car.price} x${dates.length} diárias`}</RentalPriceQuota>
            <RentalPriceTotal>{`R$ ${rentalTotal}`}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </Content>
      <Footer>
        <Button
          title="Alugar agora"
          color={colors.success}
          onPress={handleConfirmRental}
          enabled={!isLoading}
          loading={isLoading}
        />
      </Footer>
    </Container>
  );
}
