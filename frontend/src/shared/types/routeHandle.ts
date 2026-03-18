import { ReactElement } from "react";

type BreadcrumbHandle = {
  title?: string | ReactElement;
};

export type RouteHandle = {
  breadcrumb?: BreadcrumbHandle;
};
