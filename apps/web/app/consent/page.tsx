import { Suspense } from "react";
import { ConsentFlow } from "./ConsentFlow";

export default function ConsentPage() {
  return (
    <Suspense>
      <ConsentFlow />
    </Suspense>
  );
}
