import type { ReactElement } from "react";
import styles from "./ItemCard.module.css";
import { Button } from "../button/Button";
import defaultAvatar from "../../../assets/images/defaultAvatar.svg";

interface Author {
  id: number | string;
  name: string;
  avatar?: string; 
}

interface ItemCardProps {
  id: number | string;
  name: string;      
  description: string;
  image?: string;     
  author: Author;   
  isFavorite?: boolean;
  onFavoriteClick?: (id: string | number) => void;
  onAuthorClick?: (authorId: string | number) => void;
  onDetailsClick?: (id: string | number) => void;
}

export const ItemCard = ({
  id,
  name,             
  description,
  image,
  author,
  isFavorite = false,
  onFavoriteClick,
  onAuthorClick,
  onDetailsClick,
}: ItemCardProps): ReactElement => { 
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img 
          src={image || "path/to/fallback-image.png"}
          alt={name}
          loading="lazy"
        />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h4 className={styles.title}>{name}</h4>
          <p className={styles.description}>
            {description}
          </p>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.authorBtn}
            onClick={() => onAuthorClick?.(author.id)}
          >
            <div 
              className={styles.avatar} 
              style={{ backgroundImage: `url(${author.avatar || defaultAvatar})` }} 
            />
            <span className={styles.authorName}>{author.name}</span>
          </button>

          <div className={styles.actions}>
            <Button
              variant="secondary"
              isIconOnly
              className={`${styles.iconBtn} ${isFavorite ? styles.favoriteActive : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteClick?.(id);
              }}
            >
              <svg width="18" height="18">
                <use href="/src/shared/assets/sprite.svg#icon-heart" />
              </svg>
              {/* Тимчасова заглушка поверх або замість іконки */}
              <span style={{ position: 'absolute', fontSize: '12px' }}>❤️</span>
            </Button>

            <Button
              variant="secondary"
              isIconOnly
              className={styles.iconBtn}
              onClick={() => onDetailsClick?.(id)}
            >
              <svg width="18" height="18">
                <use href="/src/shared/assets/sprite.svg#icon-arrow-up-right" />
              </svg>
              {/* Тимчасова заглушка поверх або замість іконки */}
              <span style={{ position: 'absolute', fontSize: '12px' }}>❤️</span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};