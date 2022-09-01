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
} from "@mantine/core";
import { useAuth, useWorkout } from "hooks";
import { db } from "services/firebase";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns/esm";
import { IconTrash } from "@tabler/icons";

//
export default function WorkoutList({ children }) {
  const { user, dispatch } = useAuth();
  const { workouts, dispatchWorkout } = useWorkout();
  const [loading, setLoading] = useState(null);
  console.log("workouts: ", workouts);

  const deleteWorkout = async (id) => {
    const selectedWorkout = workouts.find((workout) => workout._id === id);
    console.log(selectedWorkout);
    await updateDoc(doc(db, "users", user), {
      workouts: arrayRemove(selectedWorkout),
    });
    dispatchWorkout({ type: "DELETE_WORKOUT", payload: id });
  };
  //*Animation
  const scaleY = {
    in: { opacity: 1, transform: "scaleY(1)" },
    out: { opacity: 0, transform: "scaleY(0)" },
    common: { transformOrigin: "top" },
    transitionProperty: "transform, opacity",
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
  return (
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
        workouts.map((workout, duration) => (
          <Skeleton
            className="w-full h-full"
            visible={loading}
            height={189}
            key={workout._id}
          >
            <WorkoutList.Item
              transition={duration}
              workout={workout}
              deleteWorkout={deleteWorkout}
            />
          </Skeleton>
        ))
      )}
    </Stack>
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

WorkoutList.Item = ({ workout, deleteWorkout, transition }) => {
  const temp = 200 * (transition + 1) + "ms";
  const id = workout._id;

  return (
    <li
      style={{ animationDelay: temp }}
      className="list-none animate-[pulse_1s_ease-in-out_1]"
    >
      <Card shadow="sm" p="lg" radius="md" withBorder>
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
          <Button variant="light" color="blue" mt="md" radius="md">
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
  );
};
