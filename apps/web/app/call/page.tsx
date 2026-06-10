import { Suspense } from "react";
import { CallFlow } from "./CallFlow";

export default function CallPage() {
  return (
    <Suspense>
      <CallFlow />
    </Suspense>
  );
}
