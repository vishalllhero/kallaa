export function safeMap(data: unknown): any[] {
  console.log("MAP DATA:", data);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}
