import React from "react";
import {
  TextInput,
  NumberInput,
  Checkbox,
  Button,
  Group,
  Box,
  Notification,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { FormSchema } from "validation";
import { showNotification } from "@mantine/notifications";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "services/firebase";
import { useAuth } from "hooks";
import { useWorkout } from "hooks";
import { v4 as uuidv4 } from "uuid";

//
export default function WorkoutForm() {
  const { user } = useAuth();
  const { workouts, dispatchWorkout } = useWorkout();
  // console.log(workouts);

  const addWorkout = async (values) => {
    const uuid = uuidv4();
    //!GET USER  const usersCollectionRef = collection(db, "cities");RS
    const { title, load, reps } = values;

    if (user && typeof user === "string") {
      const data = {
        title,
        load,
        reps,
        createdAt: new Date().toString(),
        _id: uuid,
      };
      await setDoc(doc(db, "users", user), {
        workouts: [...workouts, data],
      });
      dispatchWorkout({ type: "CREATE_WORKOUT", payload: data });
    }
    // const data = await getDocs(usersCollectionRef);
    // const DOCS = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    // console.log(DOCS);
  };

  const form = useForm({
    initialValues: {
      title: "",
      load: 0,
      reps: 0,
    },

    validate: yupResolver(FormSchema),
  });

  const handleSubmit = async (values) => {
    console.log(values);
    await addWorkout(values);
    form.reset();
    form.resetTouched();
    form.resetDirty();
  };

  const handleError = (errors) => {
    console.log(errors);

    if (errors.title) {
      showNotification({ message: "Please fill name field", color: "red" });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <TextInput
        label="Title"
        placeholder="Title"
        {...form.getInputProps("title")}
        withAsterisk
      />
      <NumberInput
        mt="sm"
        label="Load(kg)"
        placeholder="Load"
        {...form.getInputProps("load")}
        withAsterisk
      />
      <NumberInput
        mt="sm"
        label="Reps"
        placeholder="Reps"
        {...form.getInputProps("reps")}
        withAsterisk
      />
      <Button fullWidth color="teal" variant="filled" mt="xl" type="submit">
        Submit
      </Button>
    </form>
  );
}
