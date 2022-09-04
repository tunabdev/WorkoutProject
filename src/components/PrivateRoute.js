import { useAuth } from "hooks";
import React from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
export default function PrivateRoute({ children }) {
  const location = useLocation();
  const { user } = useAuth();

  if (!user?.uid) {
    return (
      <Navigate
        to="/login"
        replace={true}
        state={{
          return_url: location.pathname,
        }}
      />
    );
    // navigate("/", {
    //   replace: true,
    //   state: {
    //     return_url: location.pathname,
    //   },
    // });
  }

  return children;
}
