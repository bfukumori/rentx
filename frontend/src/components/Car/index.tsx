import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";

import { getAccessoryIcon } from "../../utils/getAccessoryIcon";

import {
  Container,
  Details,
  Brand,
  Name,
  About,
  Rent,
  Period,
  Price,
  Type,
} from "./styles";
import { useSync } from "../../hooks/sync";
import { Car as CarModel } from "../../database/models/Car";

interface Props extends RectButtonProps {
  data: CarModel;
}

export function Car({ data, ...rest }: Props) {
  const MotorIcon = getAccessoryIcon(data.fuel_type);
  const { isOnline } = useSync();
  return (
    <Container {...rest}>
      <Details>
        <Brand>{data.brand}</Brand>
        <Name>{data.name}</Name>
        <About>
          <Rent>
            <Period>{data.period}</Period>
            <Price>{`R$ ${isOnline ? data.price : "..."}`}</Price>
          </Rent>
          <Type>
            <MotorIcon />
          </Type>
        </About>
      </Details>
      <FastImage
        source={{ uri: data.thumbnail }}
        resizeMode={FastImage.resizeMode.contain}
        style={{ width: 167, height: 85 }}
      />
    </Container>
  );
}
