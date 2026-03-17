import { useEffect, type ReactElement } from "react";
import styles from "./RecipeCard.module.css";
import { Button } from "../button/Button";
import defaultAvatar from "../../../assets/images/defaultAvatar.svg";
import { NavLink } from "react-router-dom";
import { Icon } from "../../../shared/components/Icon/index";
import { useUserFavorites } from "../../helpers/useUserFavorites";

interface Author {
  id: number;
  name: string;
  avatar: string | null;
}

interface RecipeCardProps {
  id: string | number;
  title: string;
  description: string;
  image: string | null;
  thumbnail: string | null;
  author: Author;
  variant?: "grid" | "list";
  actionIcon?: "heart" | "trash";
  onAuthorClick?: (authorId: string | number) => void;
  onDetailsClick?: (id: string | number) => void;
}

const RecipeCard = ({
  id,
  title,
  description,
  image,
  author,
  variant = "grid",
  actionIcon = "heart",
  onAuthorClick,
  onDetailsClick,
}: RecipeCardProps): ReactElement => {
  const { ensureFavoriteStatus, isFavorite, toggleFavorite } = useUserFavorites();

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(id, isFavorite(id));
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDetailsClick?.(id);
  };

  useEffect(() => {
    ensureFavoriteStatus(id);
  }, [id]);

  return (
    <article className={`${styles.card} ${styles[variant]}`} onClick={() => onDetailsClick?.(id)}>
      <NavLink to={`/recipe/${id}`} className={styles.imageWrapper}>
        <img src={image || "https://placehold.co/600x400?text=Foodies"} alt={title} className={styles.image} />
      </NavLink>

      <div className={styles.content}>
        <div className={styles.header}>
          <h4 className={styles.title}>{title}</h4>

          {variant === "list" && (
            <div className={styles.actions}>
              <Button
                variant="secondary"
                isIconOnly
                className={styles.iconBtn}
                onClick={handleDetailsClick}
                aria-label="View details"
              >
                <Icon name="arrow-up-right" color="text-primary" size={18} />
              </Button>

              <Button
                variant="secondary"
                isIconOnly
                className={styles.iconBtn}
                onClick={handleActionClick}
                aria-label={actionIcon === "trash" ? "Delete" : "Favorite"}
              >
                <Icon 
                  name={actionIcon} 
                  color={actionIcon === "heart" && isFavorite(id) ? "color-danger" : "text-primary"} 
                  size={18} 
                />
              </Button>
            </div>
          )}
        </div>

        <p className={styles.description}>{description || "No description available"}</p>

        {variant === "grid" && (
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.authorBtn}
              onClick={(e) => {
                e.stopPropagation();
                onAuthorClick?.(author?.id || "");
              }}
            >
              <div 
                className={styles.avatar} 
                style={{ backgroundImage: `url(${author?.avatar || defaultAvatar})` }} 
              />
              <span className={styles.authorName}>{author?.name || "Anonymous"}</span>
            </button>

            <div className={styles.actions}>
              <Button 
                variant="secondary" 
                isIconOnly 
                className={styles.iconBtn} 
                onClick={handleActionClick}
                aria-label="Favorite"
              >
                <Icon 
                  name="heart" 
                  color={isFavorite(id) ? "color-danger" : "text-primary"} 
                  size={18} 
                />
              </Button>

              <Button 
                variant="secondary" 
                isIconOnly 
                className={styles.iconBtn} 
                onClick={handleDetailsClick}
                aria-label="View details"
              >
                <Icon name="arrow-up-right" color="text-primary" size={18} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default RecipeCard;
