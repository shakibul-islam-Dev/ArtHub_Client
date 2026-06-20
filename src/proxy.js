import { NextResponse } from "next/server";
import { auth } from "./lib/auth"; // পাথটি আপনার প্রজেক্ট অনুযায়ী চেক করে নেবেন

// ফাংশনের নাম অবশ্যই 'proxy' হতে হবে
export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  console.log("Proxy Session Check:", session);

  const role = session?.user?.role;
  const plan = session?.user?.plan;

  // লজিক চেক: আর্টিস্ট না হলে অথবা ফ্রি প্ল্যান না থাকলে রিডাইরেক্ট
  if (role !== "artist" || plan !== "pro") {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  return NextResponse.next();
}

// ম্যাচিং পাথ
export const config = {
  matcher: ["/artwork-details", "/dashboard/artist/:path*"],
};
