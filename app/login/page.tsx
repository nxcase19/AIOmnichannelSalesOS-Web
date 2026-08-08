"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import * as authClient from "@/lib/auth-client";

type LoginStep = "form" | "confirming" | "confirm";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<LoginStep>("form");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
        await authClient.requestMagicLink(email);
        setSubmittedEmail(email);
        setStep("confirm");
      } catch {
        // Show generic confirmation regardless of success/failure to avoid
        // account enumeration, but do not advance on validation errors.
        setError("กรุณากรอกอีเมลให้ถูกต้อง");
      } finally {
        setLoading(false);
      }
    },
    [email],
  );

  const handleResend = useCallback(async () => {
    setLoading(true);
    try {
      await authClient.requestMagicLink(submittedEmail);
    } finally {
      setLoading(false);
    }
  }, [submittedEmail]);

  if (step === "confirm") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ส่งลิงก์เข้าสู่ระบบแล้ว</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="mb-4 text-gray-700">
            หากอีเมล <strong className="font-medium">{submittedEmail}</strong>{" "}
            สามารถรับลิงก์เข้าสู่ระบบได้ เราได้ส่งลิงก์ให้แล้ว
          </p>
          <p className="mb-4 text-sm text-gray-600">
            กรุณาตรวจสอบกล่องจดหมายของคุณ ลิงก์มีอายุสั้นและใช้ได้ครั้งเดียว
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={handleResend} disabled={loading} variant="secondary">
              {loading ? "กำลังส่ง..." : "ส่งอีกครั้ง"}
            </Button>
            <Button onClick={() => setStep("form")} disabled={loading} variant="ghost">
              เปลี่ยนอีเมล
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>เข้าสู่ระบบ</CardTitle>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="you@example.com"
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? "email-error" : undefined}
            />
            {error && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "กำลังส่ง..." : "ส่งลิงก์เข้าสู่ระบบ"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
