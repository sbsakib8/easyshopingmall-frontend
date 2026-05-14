import VideoManagement from "@/src/dashboard/dropshipping/VideoManagement";

export const metadata = {
    title: "Manage Training Videos | Admin Dashboard",
    description: "Add and configure training videos for dropshippers.",
};

export default function ManageVideosAdminPage() {
    return (
        <div className="p-6 md:p-8">
            <VideoManagement />
        </div>
    );
}
