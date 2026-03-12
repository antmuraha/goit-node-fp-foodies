import { useFormik } from "formik";
import type { ReactElement } from "react";
import { Button, FormErrorMessage, Input } from "../../../shared/ui";
import { useAuth } from "../../../shared/hooks";
import { signInSchema, type SignInFormValues } from "../validation";
import styles from "./SignInForm.module.css";

type SignInFormProps = {
  onSuccess?: () => void;
};

export const SignInForm = ({ onSuccess }: SignInFormProps): ReactElement => {
  const { signIn, isSigningIn, loginError } = useAuth();

  const formik = useFormik<SignInFormValues>({
    initialValues: { email: "", password: "" },
    validationSchema: signInSchema,
    onSubmit: async (values) => {
      const success = await signIn(values);
      if (success) {
        onSuccess?.();
      }
    },
  });

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="signin-email">
          Email
        </label>
        <Input
          id="signin-email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          hasError={Boolean(formik.errors.email && formik.touched.email)}
          aria-invalid={Boolean(formik.errors.email && formik.touched.email)}
          aria-describedby={formik.errors.email && formik.touched.email ? "signin-email-error" : undefined}
          disabled={isSigningIn}
        />
        {formik.errors.email && formik.touched.email && (
          <FormErrorMessage id="signin-email-error">{formik.errors.email}</FormErrorMessage>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="signin-password">
          Password
        </label>
        <Input
          id="signin-password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          hasError={Boolean(formik.errors.password && formik.touched.password)}
          aria-invalid={Boolean(formik.errors.password && formik.touched.password)}
          aria-describedby={formik.errors.password && formik.touched.password ? "signin-password-error" : undefined}
          disabled={isSigningIn}
        />
        {formik.errors.password && formik.touched.password && (
          <FormErrorMessage id="signin-password-error">{formik.errors.password}</FormErrorMessage>
        )}
      </div>

      {loginError && <FormErrorMessage variant="form">{loginError}</FormErrorMessage>}

      <Button type="submit" disabled={isSigningIn}>
        {isSigningIn ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
};
