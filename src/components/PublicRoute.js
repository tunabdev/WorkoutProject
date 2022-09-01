import { useAuth } from "hooks";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function PublicRoute({ children }) {
  const location = useLocation();
  const { user } = useAuth();

  if (user) {
    return (
      <Navigate
        to="/"
        replace={true}
        state={{
          return_url: location.pathname,
        }}
      />
    );
  }

  return children;
}
