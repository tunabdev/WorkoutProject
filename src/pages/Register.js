import React, { useState } from "react";
import {
  TextInput,
  Button,
  PasswordInput,
  LoadingOverlay,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { RegisterSchema } from "validation";
import { showNotification } from "@mantine/notifications";
import { IconAt, IconCheck, IconX } from "@tabler/icons";
import { register } from "services/firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { checkFormStatus } from "utils";
import { useAuth } from "hooks";

export function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useAuth();
  const [loading, setLoading] = useState(null);
  const form = useForm({
    initialValues: {
      email: "",
      full_name: "",
      username: "",
      password: "",
    },
    initialTouched: {
      email: false,
      full_name: false,
      username: false,
      password: false,
    },
    validate: yupResolver(RegisterSchema),
  });

  const handleRegister = async (values) => {
    console.log("LOC STATE:", location?.state?.return_url);
    setLoading(true);
    const { email, password, username, full_name } = values;
    const response = await register(email, password, username, full_name);
    if (response?.user?.uid) {
      showNotification({
        message: "You are logged in!",
        color: "green",
        icon: <IconCheck />,
      });
      dispatch({ type: "LOGGED IN", payload: response.user.uid });
      setLoading(false);
      setTimeout(() => {
        console.log("timeout");
        navigate(location?.state?.return_url || "/");
      }, 500);
    } else {
      dispatch({ type: "NO USER" });
      setLoading(false);
      showNotification({ icon: <IconX />, message: response, color: "red" });
    }
  };

  const handleError = (errors) => {
    console.log(errors);

    if (errors.title) {
      showNotification({
        message: "Please fill all fields correctly!",
        color: "red",
      });
    }
  };

  const enabled = checkFormStatus(form) && !loading;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <LoadingOverlay
        visible={loading}
        overlayBlur={2}
        overlayOpacity={0.5}
        loaderProps={{ color: "pink", variant: "bars" }}
      />
      <form onSubmit={form.onSubmit(handleRegister, handleError)}>
        <TextInput
          label="Email"
          placeholder="Email"
          {...form.getInputProps("email")}
          withAsterisk
          icon={<IconAt size={14} />}
        />
        <TextInput
          mt="sm"
          label="Full Name"
          placeholder="Full Name"
          {...form.getInputProps("full_name")}
          withAsterisk
        />
        <TextInput
          mt="sm"
          label="Username"
          placeholder="Username"
          {...form.getInputProps("username")}
          withAsterisk
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
