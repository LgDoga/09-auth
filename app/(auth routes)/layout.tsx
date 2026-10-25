"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    router.refresh();
    setLoading(false);
  }, [router]);

  return <>{loading ? <div>Loading...</div> : children}</>;
}
