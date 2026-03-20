import { Link } from "react-router-dom";
import { Icon } from "../../shared/components/Icon";
import { AuthWidget } from "../authWidget/AuthWidget";
import styles from "./Header.module.css";
import { APP_ROUTES } from "../../shared/constants/routes";
import { HeaderNavLink } from "./HeaderNavLink";
import { BurgerMenu } from "./BurgerMenu";
import { useAuth } from "../../shared/hooks";

type HeaderProps = {
  variant: "light" | "dark";
};

export const Header = ({ variant }: HeaderProps) => {
  const { isLoggedIn } = useAuth();
  return (
    <header
      className={styles.header}
      style={{
        backgroundColor: variant === "dark" ? "var(--fd-color-main)" : "var(--fd-color-white)",
      }}
    >
      <div className={styles.logo}>
        <Link to={APP_ROUTES.HOME}>
          <Icon name="logo" color={variant === "dark" ? "color-white" : "color-main"} width={83} height={28} />
        </Link>
      </div>
      <div className={styles.nav}>
        <HeaderNavLink variant={variant} label="Home" path={APP_ROUTES.HOME} />
        <HeaderNavLink variant={variant} label="Add Recipe" path={APP_ROUTES.RECIPE_ADD} />
      </div>
      <div className={styles.actions}>
        <AuthWidget />
        {isLoggedIn && (
          <div className={styles.breakPointGuardBurgerMenu}>
            <BurgerMenu variant={variant} />
          </div>
        )}
      </div>
    </header>
  );
};
