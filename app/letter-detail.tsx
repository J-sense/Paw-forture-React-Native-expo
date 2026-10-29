import React from "react";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { LetterDetailView } from "@/components/letter/LetterDetailView";

export default function LetterDetailScreen() {
  return (
    <ScreenWrapper className="px-1">
      <LetterDetailView />
    </ScreenWrapper>
  );
}
