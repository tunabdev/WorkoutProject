import React, { useState } from "react";
import {
  TextInput,
  Button,
  PasswordInput,
  LoadingOverlay,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { LoginSchema } from "validation";
import { showNotification } from "@mantine/notifications";
import { IconAt, IconCheck, IconX } from "@tabler/icons";
import { login } from "services/firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { checkFormStatus } from "utils";
import { useAuth } from "hooks";
//
export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useAuth();
  const [loading, setLoading] = useState(null);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    initialTouched: {
      email: false,
      password: false,
    },
    validate: yupResolver(LoginSchema),
  });

  const handleLogin = async (values) => {
    console.log("LOC STATE:", location?.state?.return_url);
    setLoading(true);
    const response = await login(values.email, values.password);
    console.log("response :", response);

    if (response?.user) {
      dispatch({ type: "LOGGED IN", payload: response.user});
      setLoading(false);
      // showNotification({
      //   title: "EASY PEASY",
      //   message: "Logged in successfully",
      //   color: "green",
      //   icon: <IconCheck />,
      // });
      setTimeout(() => {
        console.log("timeout");
        navigate("/");
      }, 750);
    } else {
      dispatch({ type: "NO USER" });
      setLoading(false);
      showNotification({
        title: "OOPS!",
        message: response,
        icon: <IconX />,
        color: "red",
      });
    }
  };

  const handleError = (errors) => {
    if (errors.title) {
      showNotification({
        message: "Please fill all fields correctly!",
        color: "red",
      });
    }
  };

  const enabled = checkFormStatus(form, "login") && !loading;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <LoadingOverlay
        visible={loading}
        overlayBlur={2}
        overlayOpacity={0.5}
        loaderProps={{ color: "pink", variant: "bars" }}
      />
      <form onSubmit={form.onSubmit(handleLogin, handleError)}>
        <TextInput
          label="Email"
          placeholder="Email"
          {...form.getInputProps("email")}
          withAsterisk
          icon={<IconAt size={14} />}
        />

        <PasswordInput
          mt="sm"
          label="Password"
          placeholder="Password"
          {...form.getInputProps("password")}
          withAsterisk
        />
        <Button
          disabled={!enabled}
          fullWidth
          color="teal"
          variant="filled"
          mt="xl"
          type="submit"
          className="disabled:bg-emerald-300"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
