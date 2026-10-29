import { LetterView } from "@/components/letter/LetterView";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";

export default function ProfileTab() {
  useRefreshOnFocus();

  return (
    <ScreenWrapper className="px-1">
      <LetterView />
    </ScreenWrapper>
  );
}
