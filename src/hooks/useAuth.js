import React, { useContext } from "react";
import { AuthContext } from "context";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "useAuthContext must be used inside an AuthContextProvider!"
    );
  }
  return ctx;
}
