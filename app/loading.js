"use client"
import HomeSkeleton from "@/src/compronent/loading/HomeSkeleton";

const loading = () => {
  // Only show home skeleton when initially loading the home page/layout
  return <HomeSkeleton />;
}

export default loading