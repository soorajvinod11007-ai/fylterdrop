import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin } = body;
    const adminPin = process.env.ADMIN_PIN || "1234";

    if (!pin || typeof pin !== "string") {
      return NextResponse.json({ success: false, message: "Invalid request payload" }, { status: 400 });
    }

    if (pin.trim() !== adminPin.trim()) {
      return NextResponse.json({ success: false, message: "Incorrect PIN" }, { status: 401 });
    }

    // Generate random server auth token
    const token = crypto.randomUUID();

    const response = NextResponse.json({ success: true, message: "Authenticated successfully" });
    // Secure cookie for session verification
    response.cookies.set("fylter_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 60 * 60, // 2 hours
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: "Authentication server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = req.cookies.get("fylter_admin_session")?.value;
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}

export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete("fylter_admin_session");
  return response;
}
