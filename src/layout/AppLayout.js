import {
  AppShell,
  Header,
  useMantineTheme,
  Anchor,
  Title,
  Grid,
  Button,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import { useAuth } from "hooks";
import { useState } from "react";
import { useCallback } from "react";
import {
  Routes,
  Route,
  Outlet,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { logout } from "services/firebase";

export function AppLayout() {
  const { user, dispatch } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const isLoggedOut = await logout();

    if (isLoggedOut) {
      showNotification({
        icon: <IconCheck />,
        message: "Logged out successfully",
        color: "green",
      });
    } else {
      showNotification({
        icon: <IconX />,
        message: "Something gone wrong!",
        color: "red",
      });
    }
  };
  const handleNavigate = (To) => {
    if (!user) {
      navigate(To === "/login" ? "/register" : "/login");
    }
  };
  return (
    <AppShell
      padding="lg"
      header={
        <Header
          height={60}
          className="flex items-center justify-between px-5 text-center "
        >
          <Title>
            <Anchor to="/" component={Link} underline={false} color="orange">
              Workout Buddy
            </Anchor>
          </Title>
          {user ? (
            <Button onClick={handleLogout} color="teal" className="float-right">
              Log out
            </Button>
          ) : (
            <Button
              color="teal"
              onClick={() => handleNavigate(location.pathname)}
              className="float-right"
            >
              {location.pathname === "/login" ? "Register" : "Log in"}
            </Button>
          )}
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Outlet />
    </AppShell>
  );
}
