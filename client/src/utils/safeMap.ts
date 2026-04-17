export const safeArray = (d: unknown) => {
  if (!Array.isArray(d)) {
    console.error("Invalid map data:", d);
    return [];
  }
  return d;
};
