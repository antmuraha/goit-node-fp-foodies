import { useAuth } from "../hooks";

const useIsOwnEntity = (userId?: number | string) => {
  const { currentUser } = useAuth();
  const isOwn = userId && currentUser && userId === currentUser.id;
  return Boolean(isOwn);
};

export default useIsOwnEntity;
