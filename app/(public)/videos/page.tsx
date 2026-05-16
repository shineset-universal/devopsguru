import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import VideosClient from "./VideosClient";

export const metadata: Metadata = {
  title: "Free DevOps Video Lessons — DevOpsGuru",
  description: "Watch free DevOps video lessons covering Linux, Docker, Kubernetes, Terraform, CI/CD, GitOps, and more.",
};

export const revalidate = 60;

interface DbVideo {
  id: number;
  youtube_id: string | null;
  video_url: string | null;
  title: string;
  description: string | null;
  duration: string | null;
  course: string | null;
  course_accent: string;
  icon_key: string;
  level: string;
  sort_order: number;
}

async function getVideos(): Promise<DbVideo[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/videos`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json() as { videos: DbVideo[] };
    return data.videos ?? [];
  } catch {
    return [];
  }
}

export default async function VideosPage(): Promise<React.JSX.Element> {
  const videos = await getVideos();

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <VideosClient dbVideos={videos} />
    </div>
  );
}
