import { NextRequest, NextResponse } from "next/server";
import { checkLogin } from "./libs/services/auth-service";

const publicRoutes = ['/login'];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublicRoute = publicRoutes.includes(pathname);
  if(isPublicRoute) return NextResponse.next();
  const token = req.cookies.get('snapp-session')?.value;
  if(!token) return NextResponse.redirect(new URL('/login', req.url));
  const { isLoggedIn } = await checkLogin(token);

  if(!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if(isLoggedIn && pathname === '/login') {

    return NextResponse.redirect(new URL('/', req.url));
  }
 

  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};