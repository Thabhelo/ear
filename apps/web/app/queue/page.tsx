import { Suspense } from "react";
import { QueueFlow } from "./QueueFlow";

export default function QueuePage() {
  return (
    <Suspense>
      <QueueFlow />
    </Suspense>
  );
}
