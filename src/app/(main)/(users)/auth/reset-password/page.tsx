// app/(main)/(users)/auth/reset-password/page.tsx
"use client";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
