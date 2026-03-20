import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../shared/components/Icon";
import { APP_ROUTES } from "../../shared/constants/routes";
import styles from "./Footer.module.css";

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/goITclub/",
    icon: "facebook" as const,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/goitclub/",
    icon: "instagram" as const,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/c/GoIT",
    icon: "youtube" as const,
  },
] as const;

export const Footer = (): ReactElement => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <Link
            to={APP_ROUTES.HOME}
            className={styles.logo}
            aria-label="Foodies — go to home page"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            foodies
          </Link>
          <ul className={styles.socialList}>
            {SOCIAL_LINKS.map(({ name, href, icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={name}
                >
                  <Icon name={icon} color="text-primary" size={20} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <hr className={styles.divider} />
      <div className={styles.inner}>
        <p className={styles.copyright}>@2024, Foodies. All rights reserved</p>
      </div>
    </footer>
  );
};
