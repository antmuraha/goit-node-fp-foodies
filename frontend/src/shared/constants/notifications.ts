export const NOTIFICATION_TYPES = {
  ERROR: "error",
} as const;

export const FOLLOW_NOTIFICATIONS = {
  FOLLOW_ROLLBACK: "Unable to follow user. Changes were reverted.",
  UNFOLLOW_ROLLBACK: "Unable to unfollow user. Changes were reverted.",
} as const;

export const FAVORITE_NOTIFICATIONS = {
  ADD_ROLLBACK: "Unable to add recipe to favorites. Changes were reverted.",
  REMOVE_ROLLBACK: "Unable to remove recipe from favorites. Changes were reverted.",
} as const;
