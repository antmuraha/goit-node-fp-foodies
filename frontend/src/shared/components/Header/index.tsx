import { NavLink } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import styles from "./styles.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <NavLink to="/">LOGO</NavLink>
      <NavLink to="/">Home</NavLink>
      <NavLink to={APP_ROUTES.RECIPE_ADD}>Add Recipe</NavLink>
      <section>
        <a href="#">SIGN IN</a>
        <a href="#">SIGN UP</a>
      </section>
    </header>
  );
};

export default Header;
