export const logError = (method: string, error: unknown, payload?: unknown) => {
  if (__DEV__) {
    console.error(`[API ERROR - ${method}]`, {
      error,
      payload,
      timestamp: new Date().toISOString(),
    });
  }
};
