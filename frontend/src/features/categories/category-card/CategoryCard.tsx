import type { ReactElement } from "react";
import styles from "./CategoryCard.module.css";
import { NavLink } from "react-router-dom";
import { Icon } from "../../../shared/components/Icon";

const FALLBACK_IMAGE = "https://placehold.co/343x250?text=Category";

interface CategoryCardProps {
  id: number;
  name: string;
  image?: string;
}

export const CategoryCard = ({ id, name, image }: CategoryCardProps): ReactElement => {
  return (
    <div className={styles.categoryCard}>
      <NavLink to={`/category/${id}`} className={styles.link} aria-label={`Browse ${name} recipes`}>
        <img src={image ?? FALLBACK_IMAGE} alt={name} className={styles.image} loading="lazy" />
        <div className={styles.overlay} aria-hidden="true" />
        <div className={styles.content}>
          <div className={styles.titleWrapper}>
            <p className={styles.title}>{name}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Icon name="arrow-up-right" color="color-white" size={18} />
          </div>
        </div>
      </NavLink>
    </div>
  );
};
