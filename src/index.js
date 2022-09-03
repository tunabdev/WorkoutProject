import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
// import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "context";
import { NavigationProgress } from "@mantine/nprogress";
import { WorkoutsContextProvider } from "context/workout/workoutContext";
import { ModalsProvider } from "@mantine/modals";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
//
function AppWrapper({ children }) {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["Ctrl+J", () => toggleColorScheme()]]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <ModalsProvider>
          <NotificationsProvider position="top-right" zIndex={2077}>
            <NavigationProgress initialProgress={25} />
            {children}
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <WorkoutsContextProvider>
        <BrowserRouter>
          <AppWrapper>
            <App />
          </AppWrapper>
        </BrowserRouter>
      </WorkoutsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
