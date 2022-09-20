import { useState } from "react";
import { KeyboardAvoidingView, Keyboard, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as yup from "yup";
import { useTheme } from "styled-components/native";
import { TabScreenProps } from "../../@types/navigation";
import { BackButton } from "../../components/BackButton";
import { Feather } from "@expo/vector-icons";

import {
  Container,
  Header,
  HeaderTop,
  HeaderTitle,
  LogoutButton,
  PhotoContainer,
  Photo,
  PhotoButton,
  Content,
  Options,
  Option,
  OptionTitle,
  Section,
} from "./styles";
import { Input } from "../../components/Input";
import { useAuth } from "../../hooks/auth";
import { Button } from "../../components/Button";
import { useSync } from "../../hooks/sync";

export function Profile({ navigation }: TabScreenProps<"ProfileTab">) {
  const { user, signOut, updateUser } = useAuth();
  const { isOnline } = useSync();
  const [option, setOption] = useState<"dataEdit" | "passwordEdit">("dataEdit");
  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  const [driverLicense, setDriverLicense] = useState(user.driver_license);

  const { colors } = useTheme();

  function handleBack() {
    navigation.goBack();
  }

  function handleOptionChange(selectedOption: "dataEdit" | "passwordEdit") {
    if (!isOnline) {
      Alert.alert(
        "Você está offline",
        "Para mudar a senha, conecte-se à internet"
      );
      return;
    }
    setOption(selectedOption);
  }

  async function handleSelectAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (result.cancelled) {
      return;
    }
    if (result.uri) {
      setAvatar(result.uri);
    }
  }

  async function handleProfileUpdate() {
    try {
      const schema = yup.object().shape({
        driverLicense: yup.string().required("CNH é obrigatória"),
        name: yup.string().required("Nome é obrigatório"),
      });
      const data = { name, driverLicense };
      await schema.validate(data);
      await updateUser({
        ...user,
        name,
        driver_license: driverLicense,
        avatar,
      });
      Alert.alert("Perfil atualizado");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        Alert.alert("Opa", error.message);
      } else {
        Alert.alert("Não foi possível atualizar o perfil");
      }
    }
  }

  async function handleSignOut() {
    Alert.alert(
      "Tem certeza?",
      "Se você sair, precisará de internet para conectar-se novamente.",
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Sair",
          style: "default",
          onPress: () => signOut(),
        },
      ]
    );
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
        <Container>
          <Header>
            <HeaderTop>
              <BackButton color={colors.shape} onPress={handleBack} />
              <HeaderTitle>Editar Perfil</HeaderTitle>
              <LogoutButton onPress={handleSignOut}>
                <Feather name="power" size={24} color={colors.shape} />
              </LogoutButton>
            </HeaderTop>
            <PhotoContainer>
              {!!avatar && <Photo source={{ uri: avatar }} />}
              <PhotoButton onPress={handleSelectAvatar}>
                <Feather name="camera" size={24} color={colors.shape} />
              </PhotoButton>
            </PhotoContainer>
          </Header>
          <Content style={{ marginBottom: useBottomTabBarHeight() }}>
            <Options>
              <Option
                active={option === "dataEdit"}
                onPress={() => handleOptionChange("dataEdit")}
              >
                <OptionTitle active={option === "dataEdit"}>Dados</OptionTitle>
              </Option>
              <Option
                active={option === "passwordEdit"}
                onPress={() => handleOptionChange("passwordEdit")}
              >
                <OptionTitle active={option === "passwordEdit"}>
                  Trocar Senha
                </OptionTitle>
              </Option>
            </Options>
            {option === "dataEdit" ? (
              <Section>
                <Input
                  onChangeText={setName}
                  value={name}
                  iconName="user"
                  placeholder="Nome"
                  defaultValue={user.name}
                />
                <Input
                  iconName="mail"
                  editable={false}
                  defaultValue={user.email}
                />
                <Input
                  onChangeText={setDriverLicense}
                  value={driverLicense}
                  iconName="credit-card"
                  placeholder="CNH"
                  keyboardType="numeric"
                  defaultValue={user.driver_license}
                />
              </Section>
            ) : (
              <Section>
                <Input iconName="lock" placeholder="Senha atual" isPassword />
                <Input iconName="lock" placeholder="Nova senha" isPassword />
                <Input iconName="lock" placeholder="Repetir senha" isPassword />
              </Section>
            )}
            <Button title="Salvar alterações" onPress={handleProfileUpdate} />
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
