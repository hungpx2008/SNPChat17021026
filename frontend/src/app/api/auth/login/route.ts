import { NextResponse } from "next/server";
import { mockAuthStore } from "@/server/mock-auth-store";

export async function POST(request: Request) {
  const { email, password } = await request.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  try {
    const user = mockAuthStore.login(email, password);
    return NextResponse.json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to login.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
