export function formatDate(dateMs: number) {
  const date = new Date(dateMs);

  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}
