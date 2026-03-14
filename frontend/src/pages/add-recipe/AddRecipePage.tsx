import type { ReactElement } from "react";
import { useMatch } from "react-router-dom";
import { APP_ROUTES } from "../../shared/constants/routes";

export const AddRecipePage = (): ReactElement => {
  const isEdit = useMatch(APP_ROUTES.RECIPE_EDIT);

  return (
    <main className="token-demo-card">
      <div>{isEdit ? "EDIT" : "ADD"}</div>
      <p className="token-demo-kicker">Shared UI preview</p>
      <h1 className="token-demo-title">Add recipe page</h1>
      <p className="token-demo-text">
        Upcoming Button, Input, Select, TextArea, and Checkbox components can consume these same semantic tokens without
        adding hardcoded values.
      </p>
      <div className="token-chip-list" aria-label="Primitive readiness">
        <span className="token-chip">focus state</span>
        <span className="token-chip token-chip--outlined">error state</span>
      </div>
    </main>
  );
};
