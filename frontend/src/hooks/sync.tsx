import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { useNetInfo } from "@react-native-community/netinfo";
import { synchronize } from "@nozbe/watermelondb/sync";

import { database } from "../database";
import api from "../services/api";

interface SyncContextData {
  isOnline: boolean;
  offlineSynchronize: () => void;
}

interface SyncProviderProps {
  children: ReactNode;
}
const SyncContext = createContext<SyncContextData>({} as SyncContextData);

function SyncProvider({ children }: SyncProviderProps) {
  const [isOnline, setIsOnline] = useState(false);
  const netInfo = useNetInfo();

  async function offlineSynchronize() {
    try {
      await synchronize({
        database,
        pullChanges: async ({ lastPulledAt }) => {
          const response = await api.get(
            `cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`
          );
          const { changes, latestVersion } = response.data;

          return { changes, timestamp: latestVersion };
        },
        pushChanges: async ({ changes }) => {
          const user = changes.users;
          await api.post("users/sync", user);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (netInfo.isConnected === true) {
      setIsOnline(true);
    } else {
      setIsOnline(false);
    }
  }, [netInfo.isConnected]);

  return (
    <SyncContext.Provider value={{ isOnline, offlineSynchronize }}>
      {children}
    </SyncContext.Provider>
  );
}

function useSync(): SyncContextData {
  const context = useContext(SyncContext);
  return context;
}

export { SyncProvider, useSync };
