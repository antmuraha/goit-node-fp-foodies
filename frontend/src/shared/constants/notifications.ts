export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
} as const;

export const FOLLOW_NOTIFICATIONS = {
  FOLLOW_ROLLBACK: "Unable to follow user. Changes were reverted.",
  UNFOLLOW_ROLLBACK: "Unable to unfollow user. Changes were reverted.",
} as const;

export const AUTH_NOTIFICATIONS = {
  SIGN_IN_SUCCESS: "Welcome back! You are now signed in.",
  SIGN_UP_SUCCESS: "Account created successfully! Welcome to Foodies.",
  SESSION_EXPIRED: "Your session has expired. Please sign in again.",
} as const;

export const FAVORITE_NOTIFICATIONS = {
  ADD_ROLLBACK: "Unable to add recipe to favorites. Changes were reverted.",
  REMOVE_ROLLBACK: "Unable to remove recipe from favorites. Changes were reverted.",
  NOT_AUTHORIZED: "You must be logged in to manage your favorites.",
} as const;
