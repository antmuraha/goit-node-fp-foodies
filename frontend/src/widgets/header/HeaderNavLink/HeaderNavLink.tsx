import { NavLink } from "react-router-dom";
import styles from "./HeaderNavLink.module.css";

export type HeaderNavLinkProps = {
  label: string;
  path: string;
  onClick?: VoidFunction;
  variant: "dark" | "light";
  fullWidth?: boolean;
};

export const HeaderNavLink = ({ label, path, variant, fullWidth = false, onClick }: HeaderNavLinkProps) => {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `${styles.navLink} ${isActive ? styles.active : ""} ${variant === "light" ? styles.light : ""} ${fullWidth ? styles.fullWidth : ""}`
      }
    >
      {label}
    </NavLink>
  );
};
