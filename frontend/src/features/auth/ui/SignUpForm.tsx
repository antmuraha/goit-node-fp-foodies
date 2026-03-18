import { useState } from "react";
import { useFormik } from "formik";
import type { ReactElement } from "react";
import { Button, FormErrorMessage, Input } from "../../../shared/ui";
import { useAuth } from "../../../shared/hooks";
import { Icon } from "../../../shared/components/Icon";
import { signUpSchema, type SignUpFormValues } from "../validation";
import styles from "./SignUpForm.module.css";

type SignUpFormProps = {
  onSuccess?: () => void;
  onSignIn?: () => void;
};

export const SignUpForm = ({ onSuccess, onSignIn }: SignUpFormProps): ReactElement => {
  const { signUp, isRegistering, registerError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik<SignUpFormValues>({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: signUpSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const success = await signUp(values);
      if (success) {
        onSuccess?.();
      }
    },
  });

  const hasSubmitted = formik.submitCount > 0;
  const nameError = hasSubmitted ? formik.errors.name : undefined;
  const emailError = hasSubmitted ? formik.errors.email : undefined;
  const passwordError = hasSubmitted ? formik.errors.password : undefined;

  const isSubmitDisabled = isRegistering || !formik.values.name || !formik.values.email || !formik.values.password;

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
      <div className={styles.fields}>
        <div className={styles.fieldGroup}>
          <Input
            id="signup-name"
            name="name"
            type="text"
            placeholder="Name*"
            value={formik.values.name}
            onChange={formik.handleChange}
            hasError={Boolean(nameError)}
            disabled={isRegistering}
          />
          {nameError && <FormErrorMessage id="signup-name-error">{nameError}</FormErrorMessage>}
        </div>

        <div className={styles.fieldGroup}>
          <Input
            id="signup-email"
            name="email"
            type="email"
            placeholder="Email*"
            value={formik.values.email}
            onChange={formik.handleChange}
            hasError={Boolean(emailError)}
            disabled={isRegistering}
          />
          {emailError && <FormErrorMessage id="signup-email-error">{emailError}</FormErrorMessage>}
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.passwordWrapper}>
            <Input
              id="signup-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              hasError={Boolean(passwordError)}
              disabled={isRegistering}
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
          {passwordError && <FormErrorMessage id="signup-password-error">{passwordError}</FormErrorMessage>}
        </div>
      </div>

      {registerError && <FormErrorMessage variant="form">{registerError}</FormErrorMessage>}

      <div className={styles.btns}>
        <Button type="submit" fullWidth disabled={isSubmitDisabled} isLoading={isRegistering}>
          Create
        </Button>
        <p className={styles.switchText}>
          {"I already have an account? "}
          <button type="button" className={styles.switchLink} onClick={onSignIn}>
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};
