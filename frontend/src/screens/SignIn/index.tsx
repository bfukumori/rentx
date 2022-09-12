import React, { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, StatusBar } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import * as yup from "yup";

import { useTheme } from "styled-components/native";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

import { Container, Footer, Form, Header, Subtitle, Title } from "./styles";
import { RootStackScreenProps } from "../../@types/navigation";
import { useAuth } from "../../hooks/auth";

export function SignIn({ navigation }: RootStackScreenProps<"SignIn">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors } = useTheme();
  const { signIn } = useAuth();

  async function handleSignIn() {
    try {
      const schema = yup.object().shape({
        email: yup
          .string()
          .required("E-mail obrigatório")
          .email("Digite um e-mail válido"),
        password: yup.string().required("A senha é obrigatória"),
      });
      await schema.validate({ email, password });
      await signIn({ email, password });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        Alert.alert("Opa", error.message);
      } else {
        Alert.alert(
          "Erro na autenticação",
          "Ocorreu um erro ao fazer o login, verifique as credenciais"
        );
      }
    }
  }

  function handleNewAccount() {
    navigation.navigate("FirstStep");
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
        <Container>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />
          <Header>
            <Title>Estamos{"\n"}quase lá.</Title>
            <Subtitle>
              Faça seu login para começar{"\n"}uma experiência incrível.
            </Subtitle>
          </Header>
          <Form>
            <Input
              iconName="mail"
              placeholder="E-mail"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
            />
            <Input
              iconName="lock"
              placeholder="Senha"
              isPassword
              onChangeText={setPassword}
              value={password}
            />
          </Form>
          <Footer>
            <Button
              title="Login"
              onPress={handleSignIn}
              enabled={true}
              loading={false}
            />
            <Button
              title="Criar conta gratuita"
              color={colors.background_secondary}
              onPress={handleNewAccount}
              light
            />
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
