import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { database } from "../database";
import api from "../services/api";
import { User as ModelUser } from "../database/models/User";

interface User {
  id: string;
  user_id: string;
  name: string;
  email: string;
  driver_license: string;
  avatar: string;
  token: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  updatePassword: (oldPassword: string, password: string) => Promise<void>;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [data, setData] = useState<User>({} as User);
  const [loading, setLoading] = useState(true);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("/sessions", {
        email,
        password,
      });

      const { token, user } = response.data;
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await database.write(async () => {
        const dataUser = await database
          .get<ModelUser>("users")
          .create((newUser) => {
            newUser.user_id = user.id;
            newUser.name = user.name;
            newUser.email = user.email;
            newUser.avatar = user.avatar;
            newUser.driver_license = user.driver_license;
            newUser.token = token;
          });
        const userData = dataUser._raw as unknown as ModelUser;
        setData(userData);
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async function signOut() {
    try {
      await database.write(async () => {
        const userSelected = await database
          .get<ModelUser>("users")
          .find(data.id);
        await userSelected.destroyPermanently();
      });
      setData({} as User);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async function updateUser(user: User) {
    try {
      await database.write(async () => {
        const userSelected = await database
          .get<ModelUser>("users")
          .find(user.id);
        await userSelected.update((userData) => {
          userData.name = user.name;
          userData.driver_license = user.driver_license;
          userData.avatar = user.avatar;
        });
      });
      setData(user);
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async function updatePassword(old_password: string, password: string) {
    try {
      const updatedPassword = { old_password, password };
      api.put("users", updatedPassword);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  useEffect(() => {
    async function loadUserData() {
      const users = await database.get<ModelUser>("users").query().fetch();
      if (users.length > 0) {
        const userData = users[0]._raw as unknown as ModelUser;
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${userData.token}`;
        setData(userData);
        setLoading(false);
      }
    }
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: data,
        signIn,
        signOut,
        updateUser,
        loading,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
