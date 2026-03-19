import * as yup from "yup";

export type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
};

export const signUpSchema: yup.ObjectSchema<SignUpFormValues> = yup.object({
  name: yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});
