import { NOTIFICATION_TYPES } from "../constants/notifications";

type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

type AppNotification = {
  type: NotificationType;
  message: string;
};

export const APP_NOTIFICATION_EVENT = "app:notification";

const dispatchNotificationEvent = (notification: AppNotification): void => {
  window.dispatchEvent(new CustomEvent<AppNotification>(APP_NOTIFICATION_EVENT, { detail: notification }));
};

export const notificationService = {
  error: (message: string): void => {
    dispatchNotificationEvent({ type: NOTIFICATION_TYPES.ERROR, message });
    window.alert(message);
  },
};
