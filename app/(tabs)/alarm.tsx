import { AlarmView } from "@/components/alarm/AlarmView";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";

export default function AlarmTab() {
  useRefreshOnFocus();

  return (
    <ScreenWrapper className="">
      <AlarmView />
    </ScreenWrapper>
  );
}
