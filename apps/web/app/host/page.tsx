import { Suspense } from "react";
import { HostDashboard } from "./HostDashboard";

export default function HostPage() {
  return (
    <Suspense>
      <HostDashboard />
    </Suspense>
  );
}
