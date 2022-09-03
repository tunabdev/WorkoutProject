import * as Yup from "yup";

export const UpdateSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .lowercase()
    .matches(/^[a-zA-Z]+$/, {
      message: "Value must not contain number!",
    })
    .required("Required"),
  load: Yup.number()
    .positive("Value must be positive number!")
    .integer()
    .required("Required"),
  reps: Yup.number()
    .positive("Value must be positive number!")
    .integer()
    .required("Required"),
});
