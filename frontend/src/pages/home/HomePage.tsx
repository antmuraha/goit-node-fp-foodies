import type { ReactElement } from 'react';

export const HomePage = (): ReactElement => {
  return (
    <main className="token-demo-card">
      <p className="token-demo-kicker">Design system foundation</p>
      <h1 className="token-demo-title">Home page</h1>
      <p className="token-demo-text">
        This placeholder uses FE-UI-00 design tokens for typography, color, spacing, borders, and
        responsive type scaling.
      </p>
      <div className="token-chip-list" aria-label="Token demo chips">
        <span className="token-chip">primary action</span>
        <span className="token-chip token-chip--outlined">secondary action</span>
      </div>
    </main>
  );
};
