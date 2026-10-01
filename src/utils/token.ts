/**
 * Token manager for React Native.
 * Replace internal logic with expo-secure-store or AsyncStorage as needed.
 */
let inMemoryToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  inMemoryToken = token;
};

export const getAuthToken = async (): Promise<string> => {
  // Graceful fallback for stored tokens
  return inMemoryToken || "";
};
