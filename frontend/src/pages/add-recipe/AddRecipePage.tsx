import type { ReactElement } from 'react';

export const AddRecipePage = (): ReactElement => {
  return (
    <main className="token-demo-card">
      <p className="token-demo-kicker">Shared UI preview</p>
      <h1 className="token-demo-title">Add recipe page</h1>
      <p className="token-demo-text">
        Upcoming Button, Input, Select, TextArea, and Checkbox components can consume these same
        semantic tokens without adding hardcoded values.
      </p>
      <div className="token-chip-list" aria-label="Primitive readiness">
        <span className="token-chip">focus state</span>
        <span className="token-chip token-chip--outlined">error state</span>
      </div>
    </main>
  );
};
