import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import { Modal } from "../../../../shared/ui";
import { SignInForm } from "../SignInForm";
import { SignUpForm } from "../SignUpForm";

type AuthView = "signIn" | "signUp";

type AuthModalShellProps = {
  isOpen: boolean;
  initialView?: AuthView;
  onClose: () => void;
  onSignInSuccess?: () => void;
  onSignUpSuccess?: () => void;
};

export const AuthModalShell = ({
  isOpen,
  initialView = "signIn",
  onClose,
  onSignInSuccess,
  onSignUpSuccess,
}: AuthModalShellProps): ReactElement => {
  const [activeView, setActiveView] = useState<AuthView>(initialView);

  useEffect(() => {
    if (isOpen) {
      setActiveView(initialView);
    }
  }, [isOpen, initialView]);

  const title = activeView === "signIn" ? "Sign in" : "Sign up";

  return (
    <Modal isOpen={isOpen} title={title} onClose={onClose}>
      {activeView === "signIn" ? (
        <SignInForm onSuccess={onSignInSuccess} onCreateAccount={() => setActiveView("signUp")} />
      ) : (
        <SignUpForm onSuccess={onSignUpSuccess} onSignIn={() => setActiveView("signIn")} />
      )}
    </Modal>
  );
};
