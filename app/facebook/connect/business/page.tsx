"use client";

import { useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/button";
import { getBusinesses } from "@/lib/api";
import type { FacebookBusiness } from "@/lib/types";

export default function ConnectStep2BusinessPage() {
  const [businesses, setBusinesses] = useState<FacebookBusiness[]>([]);

  useEffect(() => {
    getBusinesses("t1").then(setBusinesses);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">เลือก Business</h1>

      <div className="mx-auto max-w-md space-y-4">
        {businesses.map((b) => (
          <LinkButton
            key={b.businessId}
            href={`/facebook/connect/pages?businessId=${encodeURIComponent(b.businessId)}`}
            variant="secondary"
            className="w-full justify-between"
          >
            <span>{b.name}</span>
            <span className="text-xs text-gray-500">{b.businessId}</span>
          </LinkButton>
        ))}
      </div>

      <div className="flex justify-start">
        <LinkButton href="/facebook/connect" variant="ghost">กลับ</LinkButton>
      </div>
    </div>
  );
}
