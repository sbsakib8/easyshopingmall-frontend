"use client";

import dynamic from "next/dynamic";

const ShopSettings = dynamic(
  () => import("@/src/dropShipping/shopSettings/ShopSettings"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    ),
  }
);

export default function ShopSettingsClient() {
  return <ShopSettings />;
}
