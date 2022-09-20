import React, { ReactNode } from "react";
import { AuthProvider } from "./auth";
import { CarProvider } from "./car";
import { SyncProvider } from "./sync";

interface AppProviderProps {
  children: ReactNode;
}

function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <SyncProvider>
        <CarProvider>{children}</CarProvider>
      </SyncProvider>
    </AuthProvider>
  );
}

export { AppProvider };
