export function fillMissingDays<T extends { date: string }>(
  data: T[],
  options?: {
    startDate?: string;
    endDate?: string;
    fill: Omit<T, "date">;
  }
): T[] {
  if (data.length === 0) return [];

  const sorted = [...data].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const start =
    options?.startDate ?? sorted[0].date;
  const end =
    options?.endDate ?? sorted[sorted.length - 1].date;

  const map = new Map(sorted.map((d) => [d.date, d]));

  const result: T[] = [];

  let current = new Date(start);
  const last = new Date(end);

  while (current <= last) {
    const dateStr = current.toISOString().split("T")[0];

    if (map.has(dateStr)) {
      result.push(map.get(dateStr)!);
    } else {
      result.push({
        date: dateStr,
        ...(options?.fill ?? {}),
      } as T);
    }

    current.setDate(current.getDate() + 1);
  }

  return result;
}