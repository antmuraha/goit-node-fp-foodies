import styles from "./BurgerMenu.module.css";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Icon } from "../../../shared/components/Icon";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../../shared/constants/routes";
import { HeaderNavLink } from "../HeaderNavLink";
import heroFoodMain from "../../../assets/images/hero-food-main.webp";
import heroFoodSmall from "../../../assets/images/hero-food-small.webp";
import { useState } from "react";

type ButtonMenuProps = {
  variant: "light" | "dark";
};

export const BurgerMenu = ({ variant }: ButtonMenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenMenu = (open: boolean) => {
    setIsOpen(open);
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenMenu}>
      <Dialog.Trigger asChild>
        <button type="button" className={styles.openBurgerMenuBtn}>
          <Icon name="burger-menu" color={variant === "dark" ? "color-white" : "color-main"} size={28} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content onInteractOutside={(e) => e.preventDefault()} className={styles.burgerMenu}>
            <VisuallyHidden.Root>
              <Dialog.Title>Мобільне меню</Dialog.Title>
              <Dialog.Description>Оберіть опцію для навігації</Dialog.Description>
            </VisuallyHidden.Root>
            <div className={styles.header}>
              <Link to={APP_ROUTES.HOME}>
                <Icon name="logo" color="color-white" width={69} height={24} />
              </Link>
              <Dialog.Close>
                <Icon name="close" color="color-white" size={28} />
              </Dialog.Close>
            </div>
            <div className={styles.menu}>
              <HeaderNavLink onClick={handleCloseMenu} fullWidth label="Home" path={APP_ROUTES.HOME} variant="dark" />
              <HeaderNavLink
                onClick={handleCloseMenu}
                fullWidth
                label="Add Recipe"
                path={APP_ROUTES.RECIPE_ADD}
                variant="dark"
              />
            </div>
            <div className={styles.images} aria-hidden="true">
              <img src={heroFoodMain} alt="" className={styles.imageMain} />
              <img src={heroFoodSmall} alt="" className={styles.imageSmall} />
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
