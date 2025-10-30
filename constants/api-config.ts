// API Configuration
export const API_CONFIG = {
  revalidation: Number(process.env.NEXT_PUBLIC_API_REVALIDATION) || 3600, // 1 hour default
  timeout: 30000, // 30 seconds
  retryCount: 3,
  retryDelay: 5000,
};
