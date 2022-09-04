import { useAuth } from "hooks";
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function PublicRoute({ children }) {
  const location = useLocation();
  const { user } = useAuth();

  console.log("publicRoute: ",user);
  
  if (user?.uid) {
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
