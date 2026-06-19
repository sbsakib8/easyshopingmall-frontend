"use client";
import dynamic from "next/dynamic";

const DropshippingVideo = dynamic(
  () => import("@/src/dropShipping/dropshippingVideo/DropshippingVideo"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    ),
  }
);

const VideoPage = () => {
  return <DropshippingVideo />;
};

export default VideoPage;
