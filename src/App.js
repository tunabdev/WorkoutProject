import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { LoadingOverlay } from "@mantine/core";
import { useRoutes } from "react-router-dom";
import routes from "routes/routes";
import { useAuth } from "hooks";
import { auth } from "services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc } from "firebase/firestore";
//
function App() {
  const showRoutes = useRoutes(routes);
  const { user, dispatch } = useAuth();
  console.log(user);

  const unsub = useCallback(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        dispatch({ type: "LOGGED IN", payload: user });
      } else {
        dispatch({ type: "NO USER" });
      }
     });
  }, [dispatch]);
  useEffect(() => {
    return unsub;
  }, [unsub]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <LoadingOverlay
        loaderProps={{ color: "pink", variant: "bars" }}
        visible={user === null}
        overlayBlur={2}
        overlayOpacity={1}
        transitionDuration={500}
      />
      <>{showRoutes}</>
    </div>
  );

  // return (

  //   <Routes>
  //     <Route path="/" element={<AppLayout />}>
  //       <Route index element={<WorkoutGrid />}></Route>

  //       <Route path="login" element={<Login />}></Route>

  //       <Route path="register" element={<Register />}></Route>
  //     </Route>
  //   </Routes>
  // );
}

export default App;
