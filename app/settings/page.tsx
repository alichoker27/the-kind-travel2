import { Suspense } from "react";
import SettingsClient from "./SettingsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | The Kind Travel",
  description: "Manage your account settings and preferences.",
};

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#d4af37",
          }}
        >
          Loading...
        </div>
      }
    >
      <SettingsClient />
    </Suspense>
  );
}
