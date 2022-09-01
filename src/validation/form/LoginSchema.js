import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  email: Yup.string().required("Email is required!").email(),
  password: Yup.string()
    .min(6, "Password is too short! - should be 8 chars")
    .max(20)
    .required("Password is required!"),
});
