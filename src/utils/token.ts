import AsyncStorage from "@react-native-async-storage/async-storage";

// Safely load SecureStore so the app never crashes if the native module isn't compiled yet
let SecureStore: typeof import("expo-secure-store") | null = null;
try {
  SecureStore = require("expo-secure-store");
} catch {
  SecureStore = null;
}

const ACCESS_TOKEN_KEY = "user_access_token";
const REFRESH_TOKEN_KEY = "user_refresh_token";
const USER_KEY = "auth_user_data";

let inMemoryToken: string | null = null;

// Storage helpers that prefer SecureStore with graceful AsyncStorage fallback
const setSecureItem = async (key: string, value: string) => {
  if (SecureStore?.setItemAsync) {
    try {
      await SecureStore.setItemAsync(key, value);
      return;
    } catch (e) {
      console.warn(`SecureStore setItem failed for ${key}, falling back to AsyncStorage:`, e);
    }
  }
  await AsyncStorage.setItem(key, value);
};

const getSecureItem = async (key: string): Promise<string | null> => {
  if (SecureStore?.getItemAsync) {
    try {
      const val = await SecureStore.getItemAsync(key);
      if (val !== null) return val;
    } catch (e) {
      console.warn(`SecureStore getItem failed for ${key}, falling back to AsyncStorage:`, e);
    }
  }
  return await AsyncStorage.getItem(key);
};

const deleteSecureItem = async (key: string) => {
  if (SecureStore?.deleteItemAsync) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      // Ignore
    }
  }
  await AsyncStorage.removeItem(key);
};

// 1. Save tokens (Login / Signup / Verify OTP)
export const saveTokens = async (
  accessToken: string | null,
  refreshToken?: string | null
) => {
  try {
    console.log("🔑 [SAVING TOKENS]");
    console.log("👉 Access Token:", accessToken);
    if (refreshToken) console.log("👉 Refresh Token:", refreshToken);

    inMemoryToken = accessToken;
    if (accessToken) {
      await setSecureItem(ACCESS_TOKEN_KEY, accessToken);
    } else {
      await deleteSecureItem(ACCESS_TOKEN_KEY);
    }

    if (refreshToken) {
      await setSecureItem(REFRESH_TOKEN_KEY, refreshToken);
    } else if (refreshToken === null) {
      await deleteSecureItem(REFRESH_TOKEN_KEY);
    }
  } catch (error) {
    console.error("Error saving tokens:", error);
  }
};

// 2. Read Access Token (Used by Axios requests)
export const getAccessToken = async (): Promise<string> => {
  if (inMemoryToken) {
    console.log("🔑 [READ TOKEN] (from memory):", inMemoryToken);
    return inMemoryToken;
  }
  try {
    const token = await getSecureItem(ACCESS_TOKEN_KEY);
    if (token) inMemoryToken = token;
    console.log("🔑 [READ TOKEN] (from storage):", token);
    return token || "";
  } catch (error) {
    console.error("Error getting access token:", error);
    return "";
  }
};

// 3. Read Refresh Token
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await getSecureItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};

// 4. Save User Profile Data
export const setAuthUser = async (user: any) => {
  try {
    if (user) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(USER_KEY);
    }
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

// 5. Read User Profile Data
export const getAuthUser = async () => {
  try {
    const stored = await AsyncStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error reading user data:", error);
    return null;
  }
};

// 6. Clear Tokens & User Data (Logout)
export const clearTokens = async () => {
  try {
    inMemoryToken = null;
    await deleteSecureItem(ACCESS_TOKEN_KEY);
    await deleteSecureItem(REFRESH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Error clearing tokens:", error);
  }
};

// Aliases for backwards compatibility with existing axios and screen imports
export const setAuthToken = saveTokens;
export const getAuthToken = getAccessToken;
export const clearAuth = clearTokens;
