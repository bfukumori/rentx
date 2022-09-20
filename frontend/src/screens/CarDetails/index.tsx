import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import Animated from "react-native-reanimated";

import { Accessory } from "../../components/Accessory";
import { BackButton } from "../../components/BackButton";
import { ImageSlider } from "../../components/ImageSlider";
import { Button } from "../../components/Button";

import { getAccessoryIcon } from "../../utils/getAccessoryIcon";
import api from "../../services/api";
import { RootStackScreenProps } from "../../@types/navigation";
import { CarDTO } from "../../dtos/CarDTO";

import { useSync } from "../../hooks/sync";
import { useAnimationsStyles } from "./animationsStyles";

import {
  Container,
  Header,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  About,
  Accessories,
  Footer,
  OfflineInfo,
} from "./styles";

export function CarDetails({
  route,
  navigation,
}: RootStackScreenProps<"CarDetails">) {
  const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);
  const { car } = route.params;
  const { headerStyleAnimation, scrollHandler, sliderCarsStyleAnimation } =
    useAnimationsStyles();
  const { isOnline } = useSync();

  function handleConfirmRental() {
    navigation.navigate("Scheduling", { car });
  }
  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchCarUpdated() {
    const response = await api.get(`cars/${car.id}`);
    setCarUpdated(response.data);
  }

  useEffect(() => {
    if (isOnline) {
      fetchCarUpdated();
    }
  }, [isOnline]);

  return (
    <Container>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <Animated.View style={headerStyleAnimation}>
        <Header>
          <BackButton onPress={handleGoBack} />
        </Header>

        <Animated.View
          style={[
            sliderCarsStyleAnimation,
            { marginTop: getStatusBarHeight() + 32 },
          ]}
        >
          <ImageSlider
            imagesUrl={
              !!carUpdated.photos
                ? carUpdated.photos
                : [{ id: car.thumbnail, photo: car.thumbnail }]
            }
          />
        </Animated.View>
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: getStatusBarHeight(),
        }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>
          <Rent>
            <Period>{car.period}</Period>
            <Price>{`R$ ${isOnline ? car.price : "..."}`}</Price>
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

        <About>{car.about}</About>
      </Animated.ScrollView>
      <Footer>
        <Button
          title="Confirmar"
          onPress={handleConfirmRental}
          enabled={isOnline}
        />
        {!isOnline && (
          <OfflineInfo>
            Conecte-se à internet para ver mais detalhes e agendar seu carro
          </OfflineInfo>
        )}
      </Footer>
    </Container>
  );
}
