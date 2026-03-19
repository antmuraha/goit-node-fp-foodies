import { NavLink } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks";
import { useAuthModal } from "../../contexts/AuthModalContext";
import styles from "./styles.module.css";

const Header = () => {
  const { isAuthenticated } = useAuth();
  const { openSignIn, openSignUp, openLogOut } = useAuthModal();

  return (
    <header className={styles.header}>
      <NavLink to={APP_ROUTES.HOME}>LOGO</NavLink>
      <NavLink to={APP_ROUTES.HOME}>Home</NavLink>
      <NavLink to={APP_ROUTES.RECIPE_ADD}>Add Recipe</NavLink>
      <section>
        {isAuthenticated ? (
          <button onClick={openLogOut}>LOG OUT</button>
        ) : (
          <>
            <button onClick={openSignIn}>SIGN IN</button>
            <button onClick={openSignUp}>SIGN UP</button>
          </>
        )}
      </section>
    </header>
  );
};

export default Header;
