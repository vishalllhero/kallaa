export const safeMap = <T, R>(
  value: any,
  callback: (item: T, index: number) => R
): R[] => {
  if (!Array.isArray(value)) return [];
  return value.map(callback);
};
