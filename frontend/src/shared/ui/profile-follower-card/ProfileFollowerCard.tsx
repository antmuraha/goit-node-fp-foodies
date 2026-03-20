import type { ReactElement } from "react";
import { useUserFollowing } from "../../helpers/useUserFollowing";
import { Icon } from '../../components/Icon';
import { Button } from "../../ui";
import styles from './ProfileFollowerCard.module.css';
import { NavLink } from "react-router-dom";
import defaultAvatar from "../../../assets/images/defaultAvatar.svg";


interface ProfileFollowerCardProps {
    id: number;
    name: string;
    avatar?: string | null;
    recipesCounter: number;
}

export const ProfileFollowerCard = ({ id, name, avatar, recipesCounter }: ProfileFollowerCardProps): ReactElement => {
    const { isFollowing, isPending, toggleFollowing } = useUserFollowing();

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
            {/* TODO: Gallery */}
            <NavLink to={`/user/${id}`}>
                <div className={styles.iconWrapper}>
                    <Icon name="arrow-up-right" color="text-primary" size={18} />
                </div>
            </NavLink>
        </div>
    )
};
