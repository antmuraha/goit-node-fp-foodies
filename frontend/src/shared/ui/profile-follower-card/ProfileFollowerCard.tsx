import { useEffect, useState, type ReactElement } from "react";
import { useUserFollowing } from "../../helpers/useUserFollowing";
import { Icon } from '../../components/Icon';
import { Button } from "../../ui";
import styles from './ProfileFollowerCard.module.css';
import { NavLink } from "react-router-dom";
import defaultAvatar from "../../../assets/images/defaultAvatar.svg";
import { recipesApi } from "../../../api/endpoints/recipesApi";
import { useAppSelector } from "../../hooks/reduxHooks";
import type { RecipeSummary } from "../../../entities/recipe/types";


interface ProfileFollowerCardProps {
    id: number;
    name: string;
    avatar?: string | null;
    recipesCounter: number;
}

const GALLERY_LIMIT = 4;

export const ProfileFollowerCard = ({ id, name, avatar, recipesCounter }: ProfileFollowerCardProps): ReactElement => {
    const { isFollowing, isPending, toggleFollowing } = useUserFollowing();
    const token = useAppSelector((state) => state.auth.token);
    const [recipes, setRecipes] = useState<RecipeSummary[]>([]);

    useEffect(() => {
        if (!token) return;
        recipesApi.getUserRecipes(token, id, { limit: GALLERY_LIMIT })
            .then((res) => setRecipes(res.data))
            .catch(() => setRecipes([]));
    }, [id, token]);

    return (
        <div className={styles.profileCard}>
            {/* User Info block */}
            <div className={styles.userInfo}>
                <div className={styles.avatarWrapper}>
                    <img src={avatar ?? defaultAvatar} alt={name} className={styles.avatar} />
                </div>
                <div className={styles.user}>
                    <div className={styles.content}>
                        <h4 className={styles.name}>{name}</h4>
                        <p className={styles.ownRecipes}>Own recipes: {recipesCounter}</p>
                    </div>
                    <Button
                        disabled={isPending(id)}
                        onClick={() => {
                            void toggleFollowing(id);
                        }}
                    >
                        {isFollowing(id) ? "Unfollow" : "Follow"}
                    </Button>
                </div>
            </div>
            {/* Recipes gallery */}
            {recipes.length > 0 && (
                <ul className={styles.gallery}>
                    {recipes.map((recipe) => (
                        <li key={recipe.id} className={styles.galleryItem}>
                            <NavLink to={`/recipe/${recipe.id}`}>
                                <img
                                    src={recipe.image ?? recipe.thumbnail ?? ""}
                                    alt={recipe.title}
                                    className={styles.galleryImage}
                                />
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}
            <NavLink to={`/user/${id}`}>
                <div className={styles.iconWrapper}>
                    <Icon name="arrow-up-right" color="text-primary" size={18} />
                </div>
            </NavLink>
        </div>
    )
};
