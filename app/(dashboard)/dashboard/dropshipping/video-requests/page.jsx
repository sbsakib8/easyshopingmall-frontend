import VideoAccessManagement from "@/src/dashboard/dropshipping/VideoAccessManagement";

export const metadata = {
    title: "Video Access Requests | Admin Dashboard",
    description: "Manage and approve video access payments for dropshippers.",
};

export default function VideoRequestsAdminPage() {
    return (
        <div className="p-6 md:p-8">
            <VideoAccessManagement />
        </div>
    );
}
