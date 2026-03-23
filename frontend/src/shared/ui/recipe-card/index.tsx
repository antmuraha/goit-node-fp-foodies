import { type ReactElement, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "../button/Button";
import defaultAvatar from "../../../assets/images/defaultAvatar.svg";
import { Icon } from "../../../shared/components/Icon/index";
import { useUserFavorites } from "../../helpers/useUserFavorites";
import { useAuth } from "../../../shared/hooks";
import { AuthModalContext } from "../../../shared/contexts/AuthModalContext";
import styles from "./RecipeCard.module.css";

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
  const { isFavorite, toggleFavorite } = useUserFavorites();
  const { isAuthenticated } = useAuth();
  const authModal = useContext(AuthModalContext);
  const navigate = useNavigate();

  const handleProtectedAction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      authModal?.openSignIn();
      return;
    }

    action();
  };

  const handleActionClick = (e: React.MouseEvent) => {
    handleProtectedAction(e, () => {
      toggleFavorite(id, isFavorite(id));
    });
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    handleProtectedAction(e, () => {
      if (onAuthorClick) {
        onAuthorClick(author.id);
      } else {
        navigate(`/user/${author.id}`);
      }
    });
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDetailsClick?.(id);
  };

  return (
    <article className={`${styles.card} ${styles[variant]}`} onClick={() => onDetailsClick?.(id)}>
      <NavLink to={`/recipe/${id}`} className={styles.imageWrapper} onClick={(e) => e.stopPropagation()}>
        <img src={image || "https://placehold.co/600x400?text=Foodies"} alt={title} className={styles.image} />
      </NavLink>

      <div className={styles.content}>
        <div className={styles.header}>
          <NavLink to={`/recipe/${id}`} className={styles.titleLink}>
            <h4 className={styles.title}>{title}</h4>
          </NavLink>

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
                className={`${styles.iconBtn} ${actionIcon === "heart" && isFavorite(id) ? styles.iconBtnActive : ""}`}
                onClick={handleActionClick}
                aria-label={actionIcon === "trash" ? "Delete" : "Favorite"}
              >
                <Icon
                  name={actionIcon}
                  color={actionIcon === "heart" && isFavorite(id) ? "color-white" : "text-primary"}
                  size={18}
                />
              </Button>
            </div>
          )}
        </div>

        <p className={styles.description}>{description || "No description available"}</p>

        {variant === "grid" && (
          <div className={styles.footer}>
            <div className={styles.authorBtn} onClick={handleAuthorClick} role="button" tabIndex={0}>
              <div className={styles.avatar} style={{ backgroundImage: `url(${author?.avatar || defaultAvatar})` }} />
              <span className={styles.authorName}>{author?.name || "Anonymous"}</span>
            </div>

            <div className={styles.actions}>
              <Button
                variant="secondary"
                isIconOnly
                className={`${styles.iconBtn} ${isFavorite(id) ? styles.iconBtnActive : ""}`}
                onClick={handleActionClick}
                aria-label="Favorite"
              >
                <Icon name="heart" color={isFavorite(id) ? "color-white" : ""} size={18} />
              </Button>

              <NavLink to={`/recipe/${id}`} className={styles.titleLink}>
                <Button
                  variant="secondary"
                  isIconOnly
                  className={styles.iconBtn}
                  onClick={handleDetailsClick}
                  aria-label="View details"
                >
                  <Icon name="arrow-up-right" color="text-primary" size={18} />
                </Button>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default RecipeCard;
