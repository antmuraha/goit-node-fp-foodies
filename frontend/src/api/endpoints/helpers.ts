export const getAuthHeaders = (token?: string): Record<string, string> | undefined => {
  if (!token) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};
