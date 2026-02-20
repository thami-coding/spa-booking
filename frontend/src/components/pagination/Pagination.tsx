import styles from "./Pagination.module.css";

function getPages(current, total) {
  const siblings = 1;
  const pages = [];

  const push = (v) => pages.push(v);

  if (total <= 7) {
    for (let i = 1; i <= total; i++) push(i);
    return pages;
  }

  const left = Math.max(2, current - siblings);
  const right = Math.min(total - 1, current + siblings);

  push(1);

  if (left > 2) push("…");

  for (let i = left; i <= right; i++) push(i);

  if (right < total - 1) push("…");

  push(total);

  return pages;
}

export default function Pagination({
  page,
  totalPages,
  setPageIndex,
  setSearchParams,
}) {
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
                onClick={() => setPageNumber(p)}
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
