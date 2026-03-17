import type { ReactElement } from "react";
import styles from "./Pagination.module.css";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const range = (start: number, end: number): number[] => {
  const result: number[] = [];
  for (let i = start; i <= end; i += 1) {
    result.push(i);
  }
  return result;
};

const getPaginationRange = (currentPage: number, totalPages: number): number[] => {
  const MAX_VISIBLE_PAGES = 5;

  if (totalPages <= MAX_VISIBLE_PAGES) {
    return range(1, totalPages);
  }

  let startPage = Math.max(1, currentPage - 2);
  let endPage = startPage + MAX_VISIBLE_PAGES - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
  }

  return range(startPage, endPage);
};

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps): ReactElement | null => {
  if (totalPages <= 1) {
    return null;
  }

  const paginationRange = getPaginationRange(currentPage, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Пагінація">
      <ul className={styles.pageNumbers}>
        {paginationRange.map((pageNumber) => {
          const isActivePage = pageNumber === currentPage;

          return (
            <li key={pageNumber}>
              <button
                className={`${styles.button} ${isActivePage ? styles.active : ""}`.trim()}
                onClick={() => onPageChange(pageNumber)}
                aria-label={isActivePage ? `Current page, page ${pageNumber}` : `Go to page ${pageNumber}`}
                aria-current={isActivePage ? "page" : undefined}
                type="button"
              >
                {pageNumber}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
