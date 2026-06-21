import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const role = session?.user?.role;
  const plan = session?.user?.plan;

  if (role !== "artist" || plan !== "pro") {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  return NextResponse.next();
}

// ম্যাচিং পাথ
export const config = {
  matcher: ["/artwork-details", "/dashboard/artist/:path*"],
};
