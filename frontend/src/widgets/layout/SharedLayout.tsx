import type { ReactElement } from "react";
import { Outlet } from "react-router-dom";

export const SharedLayout = (): ReactElement => {
  return (
    <div className="page-shell">
      <Outlet />
    </div>
  );
};
