export const getPages = (current: number, total: number) => {
  const siblings = 1;
  const pages: (string | number)[] = [];

  const push = (v: number | string) => pages.push(v);

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
};
