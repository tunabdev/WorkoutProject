import {
  AppShell,
  Header,
  useMantineTheme,
  Anchor,
  Title,
  Grid,
  Button,
  Group,
  Avatar,
  Tooltip,
  Skeleton,
} from "@mantine/core";
import { useForceUpdate } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "hooks";
import { useEffect, useState } from "react";
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
import { db, logout } from "services/firebase";

export function AppLayout() {
  const { user, dispatch } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(null);
  console.log("user :", user);

  useEffect(() => {
    const displayUser = async () => {
      setLoading(true);
      if (user) {
        const docRef = doc(db, "users", user?.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Document data:", { ...docSnap.data() });
          setUserProfile(() => ({ ...docSnap.data() }));
          setLoading(false);
        } else {
          // doc.data() will be undefined in this case
          if (location?.state?.return_url === "/register") {
            const q = query(
              collection(db, "cities"),
              where("email", "==", user.email)
            );

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              setUserProfile(() => ({ ...doc.data() }));
              setLoading(false);
            });
          }
        }
      }
    };
    displayUser();
    return () => {};
  }, [user, location?.state?.return_url]);

  useEffect(() => {
    console.log("user.uid: ", user?.uid);
    if (user) {
      const unsub = onSnapshot(doc(db, "users", user?.uid), (doc, next) => {
        if (doc.exists()) {
          console.log("Current data: ", doc.data());
          setUserProfile(() => ({ ...doc.data() }));
          setLoading(false);
        }
      });
      unsub();
    }

    return () => {};
  }, [user]);

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
            <Group>
              <Tooltip label={userProfile?.full_name} withArrow>
                <Skeleton
                  style={{ width: "auto", height: "auto" }}
                  radius="xl"
                  visible={loading === null || loading}
                >
                  <Avatar
                    src={null}
                    color="indigo"
                    alt={userProfile && userProfile?.full_name}
                  >
                    {loading !== null &&
                      !loading &&
                      userProfile &&
                      userProfile.full_name.toUpperCase().slice(0, 2)}
                  </Avatar>
                </Skeleton>
              </Tooltip>
              <Button
                onClick={handleLogout}
                color="teal"
                className="float-right"
              >
                Log out
              </Button>
            </Group>
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
