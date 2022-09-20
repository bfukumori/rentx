import styled from "styled-components/native";
import { Dimensions } from "react-native";

export const Container = styled.View`
  width: 100%;
`;

export const ImageIndexes = styled.View`
  flex-direction: row;
  align-self: flex-end;
  padding-right: 24px;
`;

export const CarImageWrapper = styled.View`
  width: ${Dimensions.get("window").width}px;
  height: 132px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
