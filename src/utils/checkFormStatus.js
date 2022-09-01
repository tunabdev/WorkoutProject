export const checkFormStatus = (form, type = "register") => {
  if (type === "login") {
    const enabled =
      form.isTouched("email") &&
      form.isTouched("password") &&
      form.isDirty("email") &&
      form.isDirty("password");
    return enabled;
  }
  if (type === "register") {
    const enabled =
      form.isTouched("email") &&
      form.isTouched("full_name") &&
      form.isTouched("username") &&
      form.isTouched("password") &&
      form.isDirty("email") &&
      form.isDirty("full_name") &&
      form.isDirty("username") &&
      form.isDirty("password");
    return enabled;
  }
};
