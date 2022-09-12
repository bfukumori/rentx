import React, { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import { useTheme } from "styled-components/native";
import { RootStackScreenProps } from "../../../@types/navigation";

import { BackButton } from "../../../components/BackButton";
import { Bullet } from "../../../components/Bullet";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import api from "../../../services/api";

import {
  Container,
  Header,
  Steps,
  Title,
  Subtitle,
  Form,
  FormTitle,
} from "./styles";

export function SecondStep({
  route,
  navigation,
}: RootStackScreenProps<"SecondStep">) {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const { user } = route.params;
  const { colors } = useTheme();

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleRegister() {
    if (!password || !passwordConfirm) {
      return Alert.alert("Informe a senha e a confirmação");
    }

    if (password !== passwordConfirm) {
      return Alert.alert("As senhas não são iguais");
    }

    try {
      await api.post("/users", {
        name: user.name,
        email: user.email,
        driver_license: user.drivingLicense,
        password,
      });

      navigation.navigate("Confirmation", {
        title: "Conta criada",
        message: "Agora é só fazer login\ne aproveitar",
        nextScreenRoute: "SignIn",
      });
    } catch (error) {
      Alert.alert("Opa", "Não foi possível cadastrar");
    }
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
        <Container>
          <Header>
            <BackButton onPress={handleGoBack} />
            <Steps>
              <Bullet />
              <Bullet active />
            </Steps>
          </Header>
          <Title>Crie sua{"\n"}conta</Title>
          <Subtitle>Faça seu cadastro de{"\n"}forma ráida e fácil</Subtitle>
          <Form>
            <FormTitle>2. Senha</FormTitle>
            <Input
              iconName="lock"
              placeholder="Senha"
              isPassword
              onChangeText={setPassword}
              value={password}
            />
            <Input
              iconName="lock"
              placeholder="Repetir senha"
              isPassword
              onChangeText={setPasswordConfirm}
              value={passwordConfirm}
            />
          </Form>
          <Button
            title="Cadastrar"
            color={colors.success}
            onPress={handleRegister}
          />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
