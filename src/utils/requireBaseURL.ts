export const requireBaseURL = (baseURL: string | undefined): string => {
  if (!baseURL) {
    throw new Error('Missing baseURL. Set use.baseURL in playwright.config.ts or BOOKER_BASE_URL env.');
  }
  return baseURL;
};
