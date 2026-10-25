import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

interface ParsedCookie {
  name: string;
  value: string;
  expires?: Date;
  path?: string;
  maxAge?: number;
}

function parseSetCookie(cookieString: string): ParsedCookie {
  const [pair, ...attributes] = cookieString.split(";").map((s) => s.trim());
  const separatorIndex = pair.indexOf("=");

  const result: ParsedCookie = {
    name: pair.slice(0, separatorIndex),
    value: pair.slice(separatorIndex + 1),
  };

  for (const attribute of attributes) {
    const [rawKey, ...rest] = attribute.split("=");
    const key = rawKey.toLowerCase();
    const value = rest.join("=");

    if (key === "expires") result.expires = new Date(value);
    if (key === "path") result.path = value;
    if (key === "max-age") result.maxAge = Number(value);
  }

  return result;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    return NextResponse.next();
  }

  if (refreshToken) {
    try {
      const sessionResponse = await checkSession();
      const setCookie = sessionResponse.headers["set-cookie"];

      if (setCookie && sessionResponse.data) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        const parsedCookies = cookieArray.map(parseSetCookie);

        for (const cookie of parsedCookies) {
          request.cookies.set(cookie.name, cookie.value);
        }

        const response = isPublicRoute
          ? NextResponse.redirect(new URL("/profile", request.url))
          : NextResponse.next({ request: { headers: request.headers } });

        for (const cookie of parsedCookies) {
          response.cookies.set(cookie.name, cookie.value, {
            expires: cookie.expires,
            path: cookie.path,
            maxAge: cookie.maxAge,
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
