export const safeMap = <T, R>(
  value: any,
  callback: (item: T, index: number) => R
): R[] => {
  console.log("TYPE CHECK:", typeof value, Array.isArray(value), value);
  if (!Array.isArray(value)) {
    console.error("Invalid data for map:", value);
    return [];
  }
  return value.map(callback);
};
