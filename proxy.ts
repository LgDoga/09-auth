import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (refreshToken) {
    try {
      const sessionResponse = await checkSession();
      const setCookie = sessionResponse.headers["set-cookie"];

      if (setCookie && sessionResponse.data) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        const response = isPublicRoute
          ? NextResponse.redirect(new URL("/", request.url))
          : NextResponse.next();

        for (const cookieString of cookieArray) {
          const parsed = parseSetCookie(cookieString);

          response.cookies.set(parsed.name, parsed.value, {
            expires: parsed.expires,
            path: parsed.path,
            maxAge: parsed.maxAge,
          });
        }

        return response;
      }
    } catch {
      // сесію не вдалося оновити, далі діємо як з гостем
    }
  }

  if (isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};