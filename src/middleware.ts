import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const routeProtection = {
 
  admin: {
    paths: ['/admin'],
    redirectTo: '/login'
  },
  
  authenticated: {
    paths: ['/profile', '/my-orders', '/wishlist', '/cart', '/checkout', '/subscription', '/seller-center'],
    redirectTo: '/login'
  },
  
  public: {
    paths: ['/', '/marketplace', '/products', '/categories', '/designers', '/editorial', '/login'],
  },

  shipper: {
    paths: ['/shipper'],
    redirectTo: '/login'
  }
};

interface JWTPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-jwt-secret');
    
    const { payload } = await jwtVerify(token, secret);
    
    return {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as string,
      iat: payload.iat as number,
      exp: payload.exp as number,
    };
  } catch (error) {
    return null;
  }
}

async function getUserFromToken(request: NextRequest): Promise<JWTPayload | null> {
  const accessToken = request.cookies.get('accessToken')?.value;
  
  if (!accessToken) {
    return null;
  }
  
  return await verifyJWT(accessToken);
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const user = await getUserFromToken(request);
  return !!user;
}

async function isAdmin(request: NextRequest): Promise<boolean> {
  const user = await getUserFromToken(request);
  return user?.role === 'ADMIN';
}

async function isShipper(request: NextRequest): Promise<boolean> {
  const user = await getUserFromToken(request);
  return user?.role === 'SHIPPER';
}

async function checkRouteAccess(pathname: string, request: NextRequest): Promise<{
  isAllowed: boolean;
  redirectTo?: string;
}> {
  // Check admin routes
  if (routeProtection.admin.paths.some(path => pathname.startsWith(path))) {
    const authenticated = await isAuthenticated(request);
    const admin = await isAdmin(request);
    if (!authenticated || !admin) {
      return { isAllowed: false, redirectTo: routeProtection.admin.redirectTo };
    }
    return { isAllowed: true };
  }

  // Check shipper routes
  if (routeProtection.shipper.paths.some(path => pathname.startsWith(path))) {
    const authenticated = await isAuthenticated(request);
    const shipper = await isShipper(request);
    if (!authenticated || !shipper) {
      return { isAllowed: false, redirectTo: routeProtection.shipper.redirectTo };
    }
    return { isAllowed: true };
  }

  if (routeProtection.authenticated.paths.some(path => pathname.startsWith(path))) {
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
      return { isAllowed: false, redirectTo: routeProtection.authenticated.redirectTo };
    }
    return { isAllowed: true };
  }
  
  return { isAllowed: true };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }
  
  const { isAllowed, redirectTo } = await checkRouteAccess(pathname, request);
  
  if (!isAllowed && redirectTo) {
    const loginUrl = new URL(redirectTo, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}; 