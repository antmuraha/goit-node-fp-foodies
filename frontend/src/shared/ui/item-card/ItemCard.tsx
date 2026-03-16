import type { ReactElement } from "react";
import styles from "./ItemCard.module.css";
import { Button } from "../button/Button";
import defaultAvatar from "../../../assets/images/defaultAvatar.svg";

interface Author {
  id: string | number;
  name: string;
  avatar?: string;
}

interface ItemCardProps {
  id: string | number;
  title: string;
  description: string;
  thumb?: string;
  author?: Author;
  isFavorite?: boolean;
  variant?: "grid" | "list";
  actionIcon?: "heart" | "trash";
  onFavoriteClick?: (id: string | number) => void;
  onAuthorClick?: (authorId: string | number) => void;
  onDetailsClick?: (id: string | number) => void;
}

export const ItemCard = ({
  id,
  title,
  description,
  thumb,
  author,
  // @ts-ignore TODO: Need to remove after implementing favorite functionality
  isFavorite = false,
  variant = "grid",
  actionIcon = "heart",
  onFavoriteClick,
  onAuthorClick,
  onDetailsClick,
}: ItemCardProps): ReactElement => {
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteClick?.(id);
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDetailsClick?.(id);
  };

  return (
    <article className={`${styles.card} ${styles[variant]}`} onClick={() => onDetailsClick?.(id)}>
      <div className={styles.imageWrapper}>
        <img src={thumb || "https://placehold.co/600x400?text=Foodies"} alt={title} className={styles.image} />
      </div>

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
                {/* TODO: Замінити на іконку */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect width="20" height="20" fill="#E2E2E2" />
                </svg>
              </Button>
              <Button
                variant="secondary"
                isIconOnly
                className={styles.iconBtn}
                onClick={handleActionClick}
                aria-label={actionIcon === "trash" ? "Delete" : "Favorite"}
              >
                {/* TODO: Замінити на іконку */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect width="20" height="20" fill="#E2E2E2" />
                </svg>
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
              <div className={styles.avatar} style={{ backgroundImage: `url(${author?.avatar || defaultAvatar})` }} />
              <span className={styles.authorName}>{author?.name || "Anonymous"}</span>
            </button>

            <div className={styles.actions}>
              <Button variant="secondary" isIconOnly className={styles.iconBtn} onClick={handleActionClick}>
                {/* TODO: Замінити на іконку */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect width="20" height="20" fill="#E2E2E2" />
                </svg>
              </Button>
              <Button variant="secondary" isIconOnly className={styles.iconBtn} onClick={handleDetailsClick}>
                {/* TODO: Замінити на іконку */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect width="20" height="20" fill="#E2E2E2" />
                </svg>
              </Button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
