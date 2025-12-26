export const getHeader = (headers: Record<string, string>, name: string): string => {
  const key = Object.keys(headers).find((h) => h.toLowerCase() === name.toLowerCase());
  return key ? headers[key] : '';
};
