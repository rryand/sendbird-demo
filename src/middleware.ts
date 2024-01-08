import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from './utils/jwt';

const publicApiEndpoints: Record<string, string[]> = { POST: ["/api/users"] };

const isPublic = (method: string, endpoint: string) => publicApiEndpoints[method]?.includes(endpoint);

export async function middleware(request: NextRequest) {
  const endpoint = request.nextUrl.pathname;
  if (!isPublic(request.method, endpoint) && endpoint.startsWith("/api")) {
    const authHeader = request.headers.get("Authorization")?.split(" ");
    if (!authHeader || authHeader[0].toLowerCase() !== "bearer") {
      return NextResponse.json({
        message: "Invalid authorization."
      }, { status: 400 });
    }

    if (!verifyJwt(authHeader[1])) {
      return NextResponse.json({
        message: "User unauthorized."
      }, { status: 401 });
    }
  }

  return NextResponse.next();
}
