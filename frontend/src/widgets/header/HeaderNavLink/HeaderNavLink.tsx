import { NavLink } from "react-router-dom";
import styles from "./HeaderNavLink.module.css";

export type HeaderNavLinkProps = {
  label: string;
  path: string;
  variant: "dark" | "light";
};

export const HeaderNavLink = ({ label, path, variant }: HeaderNavLinkProps) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `${styles.navLink} ${isActive ? styles.active : ""} ${variant === "light" ? styles.light : ""}`
      }
    >
      {label}
    </NavLink>
  );
};
