import styles from "./BurgerMenu.module.css";
import * as Dialog from "@radix-ui/react-dialog";
import { Icon } from "../../../shared/components/Icon";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../../shared/constants/routes";
import { HeaderNavLink } from "../HeaderNavLink";

type ButtonMenuProps = {
  variant: "light" | "dark";
};

export const BurgerMenu = ({ variant }: ButtonMenuProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className={styles.openBurgerMenuBtn}>
          <Icon name="burger-menu" color={variant === "dark" ? "color-white" : "color-main"} size={28} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content onInteractOutside={(e) => e.preventDefault()} className={styles.burgerMenu}>
            <div className={styles.header}>
              <Link to={APP_ROUTES.HOME}>
                <Icon name="logo" color="color-white" width={69} height={24} />
              </Link>
              <Dialog.Close>
                <Icon name="close" color="color-white" size={28} />
              </Dialog.Close>
            </div>
            <div className={styles.menu}>
              <HeaderNavLink fullWidth label="Home" path={APP_ROUTES.HOME} variant="dark" />
              <HeaderNavLink fullWidth label="Add Recipe" path={APP_ROUTES.RECIPE_ADD} variant="dark" />
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
