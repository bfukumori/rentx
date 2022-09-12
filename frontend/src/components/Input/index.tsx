import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";

import { Container, IconContainer, InputText } from "./styles";
import { useTheme } from "styled-components/native";
import { TextInputProps } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

interface Props extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>["name"];
  isPassword?: boolean;
  value?: string;
}

export function Input({ iconName, isPassword = false, value, ...rest }: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const { colors } = useTheme();

  function handleInputFocus() {
    setIsFocused(true);
  }
  function handleInputBlur() {
    setIsFocused(false);
    setIsFilled(!!value);
  }

  return (
    <Container>
      <IconContainer isFocused={isFocused}>
        <Feather
          name={iconName}
          size={24}
          color={isFocused || isFilled ? colors.main : colors.text_detail}
        />
      </IconContainer>
      <InputText
        isFocused={isFocused}
        secureTextEntry={isPassword && !isPasswordVisible}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        autoCorrect={false}
        autoCapitalize="none"
        {...rest}
      />
      {isPassword && (
        <TouchableWithoutFeedback
          onPressIn={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <IconContainer isFocused={isFocused}>
            <Feather
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={24}
              color={colors.text_detail}
            />
          </IconContainer>
        </TouchableWithoutFeedback>
      )}
    </Container>
  );
}
