import type { SetURLSearchParams } from "react-router";
import { getPages } from "../../lib/pagination";
import styles from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number | undefined;
  setPageIndex: (n: number) => void;
  setSearchParams: SetURLSearchParams;
}

export default function Pagination({
  page,
  totalPages,
  setPageIndex,
  setSearchParams,
}: PaginationProps) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = getPages(page, totalPages);

  const setPageNumber = (pageNumber: number) => {
    setPageIndex(pageNumber);
    setSearchParams({ page: String(pageNumber) });
  };

  return (
    <nav className={`${styles.pagination}`} aria-label="Pagination">
      <button
        type="button"
        className={styles.btn}
        onClick={() => setPageNumber(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        Prev
      </button>

      <ul className={styles.list}>
        {pages.map((p, idx) => (
          <li key={`${p}-${idx}`}>
            {p === "…" ? (
              <span className={styles.ellipsis} aria-hidden="true">
                …
              </span>
            ) : (
              <button
                type="button"
                className={`${styles.page} ${p === page ? styles.active : ""}`}
                onClick={() => setPageNumber(p as number)}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            )}
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={styles.btn}
        onClick={() => setPageNumber(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
