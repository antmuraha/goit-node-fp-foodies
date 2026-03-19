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
}

export const ProfileRecipeCard = ({ id, title, instructions, image }: ProfileRecipeCardProps): ReactElement => {
    return (
        <div className={styles.card}>
            <NavLink to={`/recipe/${id}`}>
                {image ? (
                    <img src={image} alt={title} className={styles.image} />
                ) : (
                    <img src={FALLBACK_IMAGE} alt={title} className={styles.image} />
                )}
            </NavLink>
            <div className={styles.content}>
                <p className={styles.title}>{title}</p>
                <p className={styles.instructions}>{instructions}</p>
            </div>
            <NavLink to={`/recipe/${id}`} className={styles.linkArrowUp}>
                <div className={styles.iconWrapper}>
                    <Icon name="arrow-up-right" color="text-primary" size={18} />
                </div>
            </NavLink>
            <button type="button" className={styles.btnTrash} disabled>
                <div className={styles.iconWrapper}>
                    <Icon name="trash" color="text-primary" size={18} />
                </div>
            </button>
        </div>
    );
};

