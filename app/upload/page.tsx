import type { Metadata } from "next";

import { detectLocale, getDictionary } from "@/dictionaries";
import { UploadPageClient } from "@/components/upload/upload-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await detectLocale();
  const dict = await getDictionary(locale);

  return {
    title: dict.upload.metadataTitle,
    description: dict.upload.pageDescription,
  };
}

export default async function UploadPage() {
  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        <UploadPageClient />
      </div>
    </main>
  );
}
