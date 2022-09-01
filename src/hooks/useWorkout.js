import React, { useContext } from "react";
import { WorkoutsContext } from "context";

export function useWorkout() {
  const ctx = useContext(WorkoutsContext);
  if (!ctx) {
    throw new Error(
      "useAuthContext must be used inside an AuthContextProvider!"
    );
  }
  return ctx;
}
