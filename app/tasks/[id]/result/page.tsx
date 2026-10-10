"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/ui/LoadingState";

export default function TaskResultRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.id;
  const router = useRouter();

  useEffect(() => {
    router.replace(`/tasks/${taskId}`);
  }, [taskId, router]);

  return (
    <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center">
      <LoadingState message="Перенаправлення на сторінку завдання..." />
    </div>
  );
}
