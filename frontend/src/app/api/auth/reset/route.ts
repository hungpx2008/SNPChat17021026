import { NextResponse } from "next/server";
import { mockAuthStore } from "@/server/mock-auth-store";

export async function POST(request: Request) {
  const { email } = await request.json().catch(() => ({}));

  if (!email) {
    return NextResponse.json({ message: "Email is required." }, { status: 400 });
  }

  try {
    mockAuthStore.requestPasswordReset(email);
    return NextResponse.json({ message: "Password reset instructions sent." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reset password.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
