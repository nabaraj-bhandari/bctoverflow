"use client";

import { ResourceManager } from "./components/resource-manager";

export function AdminDashboardContent() {
  return (
    <div className="container mx-auto p-4" suppressHydrationWarning>
      <ResourceManager />
    </div>
  );
}
