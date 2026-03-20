import { ReactElement } from "react";

type BreadcrumbHandle = {
  title?: string | ReactElement;
};

export type OverridesHandle = {
  layoutHeaderShown?: boolean;
};

export type RouteHandle = {
  breadcrumb?: BreadcrumbHandle;
  overrides?: OverridesHandle;
};
