import React, { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import * as yup from "yup";
import { RootStackScreenProps } from "../../../@types/navigation";

import { BackButton } from "../../../components/BackButton";
import { Bullet } from "../../../components/Bullet";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";

import {
  Container,
  Header,
  Steps,
  Title,
  Subtitle,
  Form,
  FormTitle,
} from "./styles";

export function FirstStep({ navigation }: RootStackScreenProps<"FirstStep">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [drivingLicense, setDrivingLicense] = useState("");

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleNextStep() {
    try {
      const schema = yup.object().shape({
        drivingLicense: yup.string().required("CNH é obrigatória"),
        email: yup
          .string()
          .required("E-mail obrigatório")
          .email("Digite um e-mail válido"),
        name: yup.string().required("Nome obrigatório"),
      });
      const data = { name, email, drivingLicense };
      await schema.validate(data);

      navigation.navigate("SecondStep", { user: data });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return Alert.alert("Opa", error.message);
      }
    }
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
        <Container>
          <Header>
            <BackButton onPress={handleGoBack} />
            <Steps>
              <Bullet active />
              <Bullet />
            </Steps>
          </Header>
          <Title>Crie sua{"\n"}conta</Title>
          <Subtitle>Faça seu cadastro de{"\n"}forma ráida e fácil</Subtitle>
          <Form>
            <FormTitle>1. Dados</FormTitle>
            <Input
              iconName="user"
              placeholder="Nome"
              value={name}
              onChangeText={setName}
            />
            <Input
              iconName="mail"
              placeholder="E-mail"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              iconName="credit-card"
              placeholder="CNH"
              keyboardType="numeric"
              value={drivingLicense}
              onChangeText={setDrivingLicense}
            />
          </Form>
          <Button title="Próximo" onPress={handleNextStep} />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
