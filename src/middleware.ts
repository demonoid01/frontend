import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { generateCsrfToken, setCsrfToken, validateCsrfToken } from "@/lib/csrf";

const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  CONTENT_MGR: 'CONTENT_MGR',
  INVENTORY_MGR: 'INVENTORY_MGR',
  CUSTOMER: 'CUSTOMER',
  GUEST: 'GUEST'
}

const PUBLIC_ROUTES = [
  "/api/auth/csrf",
  "/api/auth/forgot-password",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/register",
  "/api/installation",
  "/api/products",
  "/api/categories",
  "/api/search",
];

const CSRF_PROTECTED_METHODS = ["POST", "PUT", "DELETE", "PATCH"];


const ROLE_BASED_ACCESS = {
  "/api/dashboard": [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  "/api/users": [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  "/api/analytics": [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  "/api/products/manage": [
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.INVENTORY_MGR,
  ],
  "/api/content": [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_MGR],
  "/api/cart": [UserRole.CUSTOMER],
  "/api/wishlist": [UserRole.CUSTOMER],
  "/admin/dashboard": [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  "/admin/products": [
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.INVENTORY_MGR,
  ],
  "/admin/content": [
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CONTENT_MGR,
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Middleware Pathname:", pathname);

  const response = NextResponse.next();
  let shouldRotateCsrf = false;

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=()");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // CORS configuration
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    "https://nomadautomobile.store",
    "https://www.nomadautomobile.store",
    "http://localhost:3542",
    // "http://localhost:3000",
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Expose-Headers", "Set-Cookie");
    response.headers.set("Vary", "Origin"); // Prevent caching issues
  }

  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-CSRF-Token, X-User-ID, X-User-Role"
  );

  // Handle OPTIONS requests
  if (request.method === "OPTIONS") {
    return response;
  }

  // admin panel 

  if (pathname === "/auth/adminLogin") {
    console.log("======");

    console.log(`Redirecting admin panel: path=${pathname}`);
    return NextResponse.redirect(new URL("/auth/adminLogin", request.url));
  }

  // CSRF Protection for API Routes
  if (pathname.startsWith("/api")) {
    if (CSRF_PROTECTED_METHODS.includes(request.method)) {
      let csrfHeader = request.headers.get("X-CSRF-Token");
      const csrfCookie = request.cookies.get("csrfToken")?.value;

      // Fallback: Try to get CSRF token from body or query
      if (!csrfHeader) {
        try {
          if (request.method === "POST") {
            const clonedRequest = request.clone();
            const body = await clonedRequest.json();
            csrfHeader = body._csrf;
          } else if (request.method === "GET") {
            csrfHeader = request.nextUrl.searchParams.get("_csrf") || "";
          }
        } catch (error) {
          console.error("Error parsing CSRF token:", error);
        }
      }

      // Validate CSRF token
      if (
        !csrfCookie ||
        !csrfHeader ||
        !validateCsrfToken(csrfCookie, csrfHeader)
      ) {
        console.log(
          `CSRF validation failed: cookie=${csrfCookie}, header=${csrfHeader}, path=${pathname}`
        );
        const errorResponse = new NextResponse("Invalid CSRF token", {
          status: 403,
          headers: response.headers,
        });
        setCsrfToken(errorResponse); // Set new token for retry
        return errorResponse;
      }

      shouldRotateCsrf = true;
    }

    // Authentication for non-public API routes
    if (!PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
      const token = request.cookies.get("token")?.value;
      let user = null;

      try {
        user = token ? await verifyToken(token) : null;
      } catch (error) {
        console.error(
          `Token verification failed: token=${token}, error=${error}`
        );
      }

      if (!user) {
        console.log(`Unauthorized access: token=${token}, path=${pathname}`);
        return new NextResponse("Unauthorized", {
          status: 401,
          headers: response.headers,
        });
      }

      // Role-based access control
      for (const [routePattern, allowedRoles] of Object.entries(
        ROLE_BASED_ACCESS
      )) {
        if (
          pathname.startsWith(routePattern) &&
          !allowedRoles.includes(user.role as UserRole)
        ) {
          console.log(
            `Forbidden access: userRole=${user.role}, path=${pathname}`
          );
          return new NextResponse("Forbidden: Insufficient permissions", {
            status: 403,
            headers: response.headers,
          });
        }
      }

      // Set user info in response headers
      response.headers.set("X-User-ID", user.userId?.toString() || "");
      response.headers.set("X-User-Role", user.role?.toString() || "");
    }
  }

  // Protect Frontend Routes
  const protectedFrontendRoutes = [
    "/admin",
    "/dashboard",
    "/profile",
    "/checkout",
  ];

  if (
    protectedFrontendRoutes.some((route) => pathname.startsWith(route)) &&
    !pathname.startsWith("/auth")
  ) {
    const token = request.cookies.get("token")?.value;
    let user = null;

    try {
      user = token ? await verifyToken(token) : null;
    } catch (error) {
      console.error(
        `Token verification failed for protected route: token=${token}, error=${error}`
      );
    }
    console.log("UserRole==", UserRole);

    // if (!user) {
    //   console.log(`Redirecting unauthenticated access: path=${pathname}`);
    //   return NextResponse.redirect(new URL("/auth/login", request.url));
    // }
    console.log("*************");


    // Additional role-based checks for admin routes
    // if (pathname.startsWith("/admin")) {
    //   const userRole = user.role as UserRole;
    //   if (!(userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN)) {
    //     if (
    //       userRole === UserRole.CONTENT_MGR &&
    //       pathname.startsWith("/admin/content")
    //     ) {
    //       // Allow content managers to access content section
    //     } else if (
    //       userRole === UserRole.INVENTORY_MGR &&
    //       pathname.startsWith("/admin/products")
    //     ) {
    //       // Allow inventory managers to access products section
    //     } else {
    //       console.log(
    //         `Redirecting unauthorized admin access: userRole=${userRole}, path=${pathname}`
    //       );
    //       return NextResponse.redirect(new URL("/auth/login", request.url));
    //     }
    //   }
    // }
  }

  // Protect Checkout Route
  if (pathname.startsWith("/checkout")) {
    const token = request.cookies.get("token")?.value;
    let user = null;

    try {
      user = token ? await verifyToken(token) : null;
    } catch (error) {
      console.error(
        `Checkout token verification failed: token=${token}, error=${error}`
      );
    }

    if (!user) {
      console.log(
        `Redirecting unauthenticated checkout access: path=${pathname}`
      );
      return NextResponse.redirect(new URL("/admin/adminAuth/adminLogin", request.url));
    }
  }

  // Rotate CSRF Token After Successful Validation
  if (shouldRotateCsrf) {
    try {
      const newCsrfToken = generateCsrfToken();
      response.cookies.set({
        name: "csrfToken",
        value: newCsrfToken,
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600,
      });
      console.log(`CSRF token rotated: path=${pathname}`);
    } catch (error) {
      console.error(`Failed to rotate CSRF token: error=${error}`);
    }
  }

  return response;
}

// Middleware Configuration
export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
    "/checkout/:path*",
  ],
};
