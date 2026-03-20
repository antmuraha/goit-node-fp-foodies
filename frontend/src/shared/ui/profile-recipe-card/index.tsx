import type { ReactElement } from "react";
import { NavLink } from "react-router-dom";
import styles from "./ProfileRecipeCard.module.css";
import { Icon } from "../../components/Icon";

const FALLBACK_IMAGE = "https://placehold.co/320x320?text=Recipe";

interface ProfileRecipeCardProps {
  id: number;
  title: string;
  instructions: string;
  image?: string | null;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export const ProfileRecipeCard = ({
  id,
  title,
  instructions,
  image,
  onDelete,
  isDeleting,
}: ProfileRecipeCardProps): ReactElement => {
  return (
    <div className={styles.card}>
      <NavLink to={`/recipe/${id}`}>
        {image ? (
          <img src={image} alt={title} className={styles.image} />
        ) : (
          <img src={FALLBACK_IMAGE} alt={title} className={styles.image} />
        )}
      </NavLink>
      <div className={styles.section}>
        <div className={styles.content}>
          <NavLink to={`/recipe/${id}`}>
            <p className={styles.title}>{title}</p>
          </NavLink>
          <p className={styles.instructions}>{instructions}</p>
        </div>
        <div className={styles.btnWrapper}>
          <NavLink to={`/recipe/${id}`}>
            <div className={styles.iconWrapper}>
              <Icon name="arrow-up-right" color="text-primary" size={18} />
            </div>
          </NavLink>
          {onDelete && (
            <button
              className={styles.iconWrapper}
              onClick={onDelete}
              disabled={isDeleting}
              aria-label="Remove from recipes"
            >
              <Icon name="trash" color="text-primary" size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
