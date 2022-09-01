import React from "react";

import { Grid, TextInput, Checkbox, Button, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import WorkoutList from "./WorkoutList";
import WorkoutForm from "./WorkoutForm";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
//
export default function WorkoutGrid() {
  return (
    <Grid justify="space-between">
      <Grid.Col span={6}>
        <WorkoutList />
      </Grid.Col>
      <Grid.Col span={4}>
        <WorkoutForm />
      </Grid.Col>
    </Grid>
  );
}
