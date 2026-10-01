import React from "react";
import { useFocusEffect } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Custom hook for React Native / Expo Router.
 * Refetches stale active queries whenever the screen gains focus (e.g., navigating back to it).
 */
export function useRefreshOnFocus() {
  const queryClient = useQueryClient();
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      // Skip the first focus event because useQuery already fetches on mount
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      // Refetch only active stale queries when coming back to this screen
      queryClient.refetchQueries({
        stale: true,
        type: "active",
      });
    }, [queryClient])
  );
}
