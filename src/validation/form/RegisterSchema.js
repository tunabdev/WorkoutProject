import * as Yup from "yup";

export const RegisterSchema = Yup.object().shape({
  email: Yup.string().required("Email is required!").email(),
  full_name: Yup.string().required("Full name is required!"),
  username: Yup.mixed()
    .required("Username is required!")
    .test({
      message: "Pls provide valid username!",
      test: (str) => /^[a-z0-9\.\_]+$/i.test(str),
    }),
  password: Yup.string()
    .min(6, "Password is too short! - should be 8 chars")
    .max(20)
    .required("Password is required!"),
});
