import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// brfentreprenad.se has ~0 direct search volume (keyword-data.md) — it exists
// only as a brand/redirect domain into the main site (strategy.md §3).
const REDIRECT_HOSTS = new Set(["brfentreprenad.se", "www.brfentreprenad.se"]);
const REDIRECT_TARGET = "https://brfinspektion.se/upphandling";

async function handleAdminAuth(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) return null;
  if (request.nextUrl.pathname === "/admin/logga-in") return null;

  const session = await auth();
  if (!session?.user) {
    const loginUrl = new URL("/admin/logga-in", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    request.nextUrl.pathname.startsWith("/admin/installningar") &&
    session.user.role !== "OWNER"
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return null;
}

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (REDIRECT_HOSTS.has(host)) {
    return NextResponse.redirect(REDIRECT_TARGET, 301);
  }

  const adminResponse = await handleAdminAuth(request);
  if (adminResponse) return adminResponse;

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
