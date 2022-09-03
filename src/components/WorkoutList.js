import React, { useEffect, useState } from "react";
import {
  Card,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  Skeleton,
  clsx,
  Box,
  Overlay,
  Transition,
  LoadingOverlay,
  TextInput,
  NumberInput,
  Modal,
} from "@mantine/core";
import { useAuth, useWorkout } from "hooks";
import { db } from "services/firebase";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns/esm";
import { IconTrash } from "@tabler/icons";
import { useForm, yupResolver } from "@mantine/form";
import { UpdateSchema } from "validation";
import { randomId } from "@mantine/hooks";
import { closeAllModals, closeModal } from "@mantine/modals";
//
export default function WorkoutList() {
  const { user } = useAuth();
  const { workouts, dispatchWorkout } = useWorkout();
  const [loading, setLoading] = useState(null);
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(null);
  //
  const randomKey = randomId() + Math.random();

  const openUpdateModal = async (id, idx) => {
    const selectedWorkout = workouts.find((workout) => workout._id === id);
    setSelected(() => [selectedWorkout, idx]);
    // setSelected(selectedWorkout);
    form.setValues({
      title: selectedWorkout?.title,
      load: selectedWorkout?.load,
      reps: selectedWorkout?.reps,
    });

    setOpened(true);
    // openModal({
    //   title: "Update Workout",
    //   children: (
    //     <>
    //       <TextInput
    //         label="Title"
    //         placeholder="Title"
    //         data-autofocus
    //         value={title}
    //         onChange={(event) => setTitle(event.currentTarget.value)}
    //         // {...form.getInputProps("title")}
    //       />
    //       <NumberInput label="Load(kg)" placeholder="Load(kg)" min={0} />
    //       <NumberInput
    //         label="Reps"
    //         placeholder="Reps"
    //         min={0}
    //         onChange={(e) => {}}

    //         // {...form.getInputProps("reps")}
    //       />
    //       <Button
    //         variant="filled"
    //         color="teal"
    //         fullWidth
    //         type="submit"
    //         // onClick={}
    //         mt="md"
    //       >
    //         Update
    //       </Button>
    //     </>
    //   ),
    // });
  };

  const deleteWorkout = async (id) => {
    const selectedWorkout = workouts.find((workout) => workout._id === id);
    console.log(selectedWorkout);
    await updateDoc(doc(db, "users", user), {
      workouts: arrayRemove(selectedWorkout),
    });
    dispatchWorkout({ type: "DELETE_WORKOUT", payload: id });
  };
  useEffect(() => {
    // const controller = new AbortController();
    setLoading(true);
    if (user) {
      const fetchWorkoutList = async () => {
        const docRef = doc(db, "users", user);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          dispatchWorkout({
            type: "SET_WORKOUTS",
            payload: docSnap.data().workouts.reverse(),
          });
          setLoading(false);
        } else {
          console.warn("no doc!!");
          dispatchWorkout({ type: "SET_WORKOUTS", payload: [] });
          setLoading(false);
        }
      };
      console.log("list useEffect!!");
      fetchWorkoutList();
    }

    return () => {};
  }, [user, dispatchWorkout]);

  // return <pre> {JSON.stringify(workouts, null, 2)}</pre>;

  const form = useForm({
    initialValues: {
      title: "",
      load: 0,
      reps: 0,
    },

    validate: yupResolver(UpdateSchema),
  });
  const handleUpdate = async (value) => {
    setLoading(true);
    const { title, load, reps } = value;

    let data = {
      ...selected[0],
      title,
      load,
      reps,
    };
    console.log(data);

    const filteredWorkout = workouts.filter(
      (workout) => workout._id !== selected[0]._id
    );

    filteredWorkout.splice(selected[1], 0, data);
    console.log("fiWo: ", filteredWorkout);
    await updateDoc(doc(db, "users", user), {
      workouts: filteredWorkout,
    });
    dispatchWorkout({
      type: "SET_WORKOUTS",
      payload: filteredWorkout,
    });
    setLoading(false);
    setOpened(false);
  };
  const handleUpdateError = (errors) => {
    console.log(errors);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Update Workout"
        overlayBlur={2}
        overlayOpacity={0.55}
      >
        <form onSubmit={form.onSubmit(handleUpdate, handleUpdateError)}>
          <TextInput
            label="Title"
            placeholder="Title"
            data-autofocus
            {...form.getInputProps("title")}
          />
          <NumberInput
            label="Load(kg)"
            placeholder="Load(kg)"
            min={0}
            {...form.getInputProps("load")}
          />
          <NumberInput
            label="Reps"
            placeholder="Reps"
            min={0}
            {...form.getInputProps("reps")}
          />
          <Button
            disabled={loading}
            variant="filled"
            color="teal"
            fullWidth
            type="submit"
            // onClick={}
            mt="md"
          >
            Update
          </Button>
        </form>
      </Modal>
      {/*Modal sonrası */}
      <Stack spacing="lg" className="w-full h-full">
        {loading || workouts?.length === 0 ? (
          <Skeleton className="w-full h-[80vh]" visible={loading} radius="lg">
            <Box
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[2],
                textAlign: "center",
                padding: theme.spacing.xl,
                borderRadius: theme.radius.md,

                "&:hover": {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[5]
                      : theme.colors.gray[3],
                },
              })}
            >
              <Text size="xl">
                {loading !== null && !loading && workouts?.length === 0
                  ? "Found no workout!😮"
                  : ""}
              </Text>
            </Box>
          </Skeleton>
        ) : (
          React.Children.toArray(
            workouts.map((workout, key) => {
              return (
                <Skeleton
                  className="w-full h-full"
                  visible={loading}
                  height={189}
                >
                  <WorkoutList.Item
                    transition={key}
                    workout={workout}
                    deleteWorkout={deleteWorkout}
                    openUpdateModal={openUpdateModal}
                  />
                </Skeleton>
              );
            })
          )
        )}
      </Stack>
    </>
  );
}

/*
     <Transition
          mounted={true}
          transition={scaleY}
          duration={2000}
          timingFunction="ease"
        >
          {(styles) => {
            return (
              <Box
              style={styles}
                sx={(theme) => ({
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[6]
                      : theme.colors.gray[2],
                  textAlign: "center",
                  padding: theme.spacing.xl,
                  borderRadius: theme.radius.md,
                  cursor: "pointer",

                  "&:hover": {
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[5]
                        : theme.colors.gray[3],
                  },
                })}
              >
                <Text size="xl"> Found no workout! 😮</Text>
              </Box>
            );
          }}
        </Transition>
*/

WorkoutList.Item = ({
  workout,
  deleteWorkout,
  openUpdateModal,
  transition,
}) => {
  const temp = 200 * (transition + 1) + "ms";
  const id = workout._id;

  return (
    <>
      <li
        style={{ animationDelay: temp }}
        className="list-none animate-[pulse_1s_ease-in-out_1]"
      >
        <Card shadow="sm" p="lg" radius="md" withBorder height={179}>
          {/* <Modal
          centered
          opened={!opened}
          onClose={() => setOpened(!opened)}
          title="Introduce yourself!"
          withCloseButton
          overl
        >
          <TextInput label="Title" placeholder="Title" withAsterisk />
          <NumberInput
            mt="sm"
            label="Load(kg)"
            placeholder="Load"
            withAsterisk
          />
          <NumberInput mt="sm" label="Reps" placeholder="Reps" withAsterisk />
          <Group position="center">
            <Button type="submit" onClick={() => setOpened(true)}>
              Open Modal
            </Button>
          </Group>
        </Modal> */}

          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>{workout.title}</Text>
            <Badge color="pink" variant="light">
              {formatDistanceToNow(new Date(workout.createdAt), {
                addSuffix: true,
              })}
            </Badge>
          </Group>
          <Text size="sm" color="dimmed">
            Load: {workout.load}
          </Text>
          <Text size="sm" color="dimmed">
            Workout Reps: {workout.reps}
          </Text>
          <div className="flex items-center justify-between">
            <Button
              variant="light"
              color="blue"
              mt="md"
              radius="md"
              onClick={() => {
                openUpdateModal(id, transition);
              }}
            >
              Update
            </Button>
            <Button
              leftIcon={<IconTrash size={14} />}
              variant="light"
              color="red"
              mt="md"
              radius="md"
              onClick={() => deleteWorkout(id)}
            >
              Delete
            </Button>
          </div>
        </Card>
      </li>
    </>
  );
};
