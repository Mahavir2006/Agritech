"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Optionally hide on the main landing page if desired,
  // currently enabled for all pages as requested.
  if (pathname === "/") return null;

  return (
    <button
      onClick={() => router.back()}
      className="fixed bottom-6 left-6 z-[9999] p-4 bg-white text-green-700 rounded-full shadow-2xl border-2 border-green-500 hover:bg-green-50 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 active:scale-95 group"
      aria-label="Go Back"
      title="Go Back"
    >
      <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
    </button>
  );
}
