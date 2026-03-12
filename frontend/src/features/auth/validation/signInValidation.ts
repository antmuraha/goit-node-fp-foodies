import * as yup from "yup";

export type SignInFormValues = {
  email: string;
  password: string;
};

export const signInSchema: yup.ObjectSchema<SignInFormValues> = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
});
