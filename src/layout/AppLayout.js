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
import { useAuth, useWorkout } from "hooks";
import { useCallback } from "react";
import {
  Routes,
  Route,
  Outlet,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { logout } from "services/firebase";

export function AppLayout() {
  const { user, dispatch } = useAuth();
  const { dispatchWorkout } = useWorkout();
  const navigate = useNavigate();
  const dispatches = useCallback(() => {
    // dispatchWorkout({ type: "SET_WORKOUTS", payload: [] });
    dispatch({ type: "LOGGED OUT" });
  }, [dispatch]);

  const handleLogout = async () => {
    const isLoggedOut = await logout();

    if (isLoggedOut) {
      showNotification({
        icon: <IconCheck />,
        message: "Logged out successfully",
        color: "green",
      });
      dispatches();
    } else {
      showNotification({
        icon: <IconX />,
        message: "Something gone wrong!",
        color: "red",
      });
    }
  };
  const handleLogin = () => {
    if (!user) {
      navigate("/login");
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
            <Button color="teal" onClick={handleLogin} className="float-right">
              Log in
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
