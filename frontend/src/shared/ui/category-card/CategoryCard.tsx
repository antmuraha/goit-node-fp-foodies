import type { ReactElement } from "react";
import styles from './CategoryCard.module.css';
import { NavLink } from 'react-router-dom';
import { Icon } from "../../components/Icon";

const FALLBACK_IMAGE = "https://placehold.co/320x320?text=Category";

interface CategoryCardProps {
    id: number;
    name: string;
    image?: string;
}

export const CategoryCard = ({
    id,
    name,
    image,
}: CategoryCardProps): ReactElement => {
    return (
        <div className={styles.categoryCard}>
            {image ? (
                <img src={image} alt={name} className={styles.image} />
            ) : (
                <img src={FALLBACK_IMAGE} alt={name} className={styles.image} />
            )}
            <div className={styles.content}>
                <h3 className={styles.title}>{name}</h3>
                <NavLink to={`/category/${id}`} className={styles.link}>
                    <Icon name="arrow-up-right" color="color-white" size={18} />
                </NavLink>
            </div>
        </div>
    );
};
