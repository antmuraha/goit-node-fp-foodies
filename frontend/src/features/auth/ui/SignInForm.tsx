import { useState } from "react";
import { useFormik } from "formik";
import type { ReactElement } from "react";
import { Button, FormErrorMessage, Input } from "../../../shared/ui";
import { useAuth } from "../../../shared/hooks";
import { Icon } from "../../../shared/components/Icon";
import { signInSchema, type SignInFormValues } from "../validation";
import styles from "./SignInForm.module.css";

type SignInFormProps = {
  onSuccess?: () => void;
  onCreateAccount?: () => void;
};

export const SignInForm = ({ onSuccess, onCreateAccount }: SignInFormProps): ReactElement => {
  const { signIn, isSigningIn, loginError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik<SignInFormValues>({
    initialValues: { email: "", password: "" },
    validationSchema: signInSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const success = await signIn(values);
      if (success) {
        onSuccess?.();
      }
    },
  });

  const hasSubmitted = formik.submitCount > 0;
  const emailError = hasSubmitted ? formik.errors.email : undefined;
  const passwordError = hasSubmitted ? formik.errors.password : undefined;

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
      <div className={styles.fields}>
        <div className={styles.fieldGroup}>
          <Input
            id="signin-email"
            name="email"
            type="email"
            placeholder="Email*"
            value={formik.values.email}
            onChange={formik.handleChange}
            hasError={Boolean(emailError)}
            disabled={isSigningIn}
          />
          {emailError && <FormErrorMessage id="signin-email-error">{emailError}</FormErrorMessage>}
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.passwordWrapper}>
            <Input
              id="signin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              hasError={Boolean(passwordError)}
              disabled={isSigningIn}
              className={styles.passwordInput}
            />
            <button
              type="button"
              className={styles.togglePasswordBtn}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              <Icon name={showPassword ? "eye-off" : "eye"} color="text-primary" size={20} />
            </button>
          </div>
          {passwordError && <FormErrorMessage id="signin-password-error">{passwordError}</FormErrorMessage>}
        </div>
      </div>

      {loginError && <FormErrorMessage variant="form">{loginError}</FormErrorMessage>}

      <div className={styles.btns}>
        <Button
          type="submit"
          fullWidth
          disabled={isSigningIn || !formik.values.email || !formik.values.password}
          isLoading={isSigningIn}
        >
          Sign in
        </Button>
        <p className={styles.switchText}>
          {"Don't have an account? "}
          <button type="button" className={styles.switchLink} onClick={onCreateAccount}>
            Create an account
          </button>
        </p>
      </div>
    </form>
  );
};
