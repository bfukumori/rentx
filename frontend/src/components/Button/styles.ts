import { RectButton, RectButtonProps } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

interface ButtonProps {
  color?: string;
  enabled?: boolean;
  loading?: boolean;
}

interface ButtonTextProps {
  light?: boolean;
}

export const Container = styled(
  RectButton as new (props: RectButtonProps) => RectButton
)<ButtonProps>`
  margin-bottom: 8px;
  width: 100%;
  padding: 19px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, color }) =>
    color ? color : theme.colors.main};

  opacity: ${({ enabled, loading }) =>
    enabled === false || loading === true ? 0.5 : 1};
`;

export const Title = styled.Text<ButtonTextProps>`
  font-size: ${RFValue(15)}px;
  font-family: ${({ theme }) => theme.fonts.primary_500};
  color: ${({ theme, light }) =>
    light ? theme.colors.shape_dark : theme.colors.shape};
`;
