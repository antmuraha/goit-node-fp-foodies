import { UIMatch, useMatches } from "react-router-dom";
import { OverridesHandle, RouteHandle } from "../types/routeHandle";

export const useRouteHandleOverrides = () => {
  const matches = useMatches() as UIMatch<unknown, RouteHandle>[];

  const overrides = matches.reduce(
    (acc, match) => (match.handle ? { ...acc, ...match.handle.overrides } : acc),
    {},
  ) as OverridesHandle;

  return overrides;
};
