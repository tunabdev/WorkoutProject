import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useReducer, useState } from "react";
import { auth } from "services/firebase";

export const AuthContext = createContext();

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGGED IN":
      return {
        ...state,
        user: action.payload,
        auth: true,
      };

    case "LOGGED OUT":
      return {
        ...state,
        user: false,
        auth: false,
      };
    case "NO USER":
      return {
        ...state,
        user: false,
        auth: false,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, {
    user: null,
    auth: null,
  });


  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
