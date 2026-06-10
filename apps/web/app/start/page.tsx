import { Suspense } from "react";
import { StartFlow } from "./StartFlow";

export default function StartPage() {
  return (
    <Suspense>
      <StartFlow />
    </Suspense>
  );
}
