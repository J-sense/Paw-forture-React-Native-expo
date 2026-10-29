import React from "react";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { CatTarotView } from "@/components/cat-tarot/CatTarotView";
import { CatTarotScreenWrapper } from "@/components/cat-tarot/CatTarotScreenWrapper";

export default function NotificationsTab() {
  useRefreshOnFocus();

  return (
    <CatTarotScreenWrapper className="px-1">
      <CatTarotView />
    </CatTarotScreenWrapper>
  );
}
