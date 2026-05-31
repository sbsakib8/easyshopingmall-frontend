import VideoManagement from "@/src/dashboard/dropshipping/VideoManagement";

export const metadata = {
  title: "Manage Training Videos | Admin Dashboard",
  description: "Add and configure training videos for dropshippers.",
};

export default function ManageVideosAdminPage() {
  return (
    <>
      <VideoManagement />
    </>
  );
}
