import { NavLink } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import { AuthWidget } from "../../../widgets/authWidget/AuthWidget";
import styles from "./styles.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <NavLink to={APP_ROUTES.HOME}>LOGO</NavLink>
      <NavLink to={APP_ROUTES.HOME}>Home</NavLink>
      <NavLink to={APP_ROUTES.RECIPE_ADD}>Add Recipe</NavLink>
      <AuthWidget />
    </header>
  );
};

export default Header;
