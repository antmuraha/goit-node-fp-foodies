import { NavLink, useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks";
import styles from "./styles.module.css";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <NavLink to={APP_ROUTES.HOME}>LOGO</NavLink>
      <NavLink to={APP_ROUTES.HOME}>Home</NavLink>
      <NavLink to={APP_ROUTES.RECIPE_ADD}>Add Recipe</NavLink>
      <section>
        {isAuthenticated ? (
          <button onClick={() => navigate(".", { state: { openLogOut: true } })}>LOG OUT</button>
        ) : (
          <>
            <button onClick={() => navigate(".", { state: { openSignIn: true } })}>SIGN IN</button>
            <button onClick={() => navigate(".", { state: { openSignUp: true } })}>SIGN UP</button>
          </>
        )}
      </section>
    </header>
  );
};

export default Header;
