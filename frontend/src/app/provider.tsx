"use client";
import React from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const store = makeStore();

  return (
    <Provider store={store}>
      <PersistGate persistor={store.__persistor} loading={<div>Loading</div>}>
        {children}
      </PersistGate>
    </Provider>
  );
}
