export function safeMap<T, U>(
  data: unknown,
  mapper: (item: T, index: number, array: T[]) => U
): U[] {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map(mapper);
}
