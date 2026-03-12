import type { ReactElement } from "react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDataUser } from "../../shared/hooks";

export const UserPage = (): ReactElement => {
  const { id } = useParams();
  const userId = useMemo(() => {
    const numericId = Number(id);
    return Number.isInteger(numericId) && numericId > 0 ? numericId : undefined;
  }, [id]);

  const { user, isLoading, error } = useDataUser(userId);

  return (
    <main>
      <h1>User page</h1>
      {isLoading && <p>Loading user profile...</p>}
      {error && <p>User error: {error}</p>}
      {!isLoading && !error && user && (
        <section>
          <h2>{user.name}</h2>
          <p>ID: {user.id}</p>
          {user.email && <p>Email: {user.email}</p>}
        </section>
      )}
      {!isLoading && !error && !user && <p>No user selected.</p>}
    </main>
  );
};
