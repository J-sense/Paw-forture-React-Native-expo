import React from "react";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { AddLetterView } from "@/components/letter/AddLetterView";

export default function AddLetterScreen() {
  return (
    <ScreenWrapper className="px-1">
      <AddLetterView />
    </ScreenWrapper>
  );
}
