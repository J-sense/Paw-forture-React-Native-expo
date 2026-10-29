import React from "react";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { CalendarView } from "@/components/calendar/CalendarView";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";

export default function ExploreTab() {
  useRefreshOnFocus();

  return (
    <ScreenWrapper className="px-2">
      <CalendarView />
    </ScreenWrapper>
  );
}
