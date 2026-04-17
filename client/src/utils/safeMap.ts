export function safeMap(data: unknown): any[] {
  console.log("MAP DATA:", data, typeof data);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  console.error("Invalid data for map:", data);
  return [];
}
