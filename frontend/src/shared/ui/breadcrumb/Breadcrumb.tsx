import { Link, UIMatch, useMatches } from "react-router-dom";
import { RouteHandle } from "../../types/routeHandle";
import styles from "./Breadcrumb.module.css";
import { clsx } from "clsx";

export const Breadcrumb = () => {
  const matches = useMatches() as UIMatch<unknown, RouteHandle>[];
  const crumbs = matches
    .filter((match) => match.handle?.breadcrumb)
    .map((match) => ({
      title: match.handle?.breadcrumb?.title,
      pathname: match.pathname,
    }));

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <ol className={styles.breadcrumbList}>
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        const title = typeof crumb.title === "string" ? crumb.title : "...";

        return (
          <li key={`${crumb.pathname}-${index}`} className={styles.breadcrumbItem}>
            {!isLast ? (
              <Link to={crumb.pathname} className={styles.breadcrumbLink}>
                {title}
              </Link>
            ) : (
              <span className={clsx(styles.breadcrumbItem, styles.breadcrumbCurrent)}>{title}</span>
            )}
            {!isLast && <span className={styles.separator}>/</span>}
          </li>
        );
      })}
    </ol>
  );
};
