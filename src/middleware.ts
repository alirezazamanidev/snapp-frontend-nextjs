import { NextRequest, NextResponse } from "next/server";

const checkLogin = async (req: NextRequest) => {
  const authToken = req.cookies.get('snapp-session');
  if(!authToken) {
    return {
      isLoggedIn: false,
      user: null
    }
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-login`, {
    headers: {
      'Cookie': `snapp-session=${authToken.value}`
    }
  });
  
  if(res.status !== 200) {
    return {
      isLoggedIn: false,
      user: null
    }
  }
  const data = await res.json();
  return {
    isLoggedIn: true,
    user: data.user
  }
}

const publicRoutes = ['/login'];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublicRoute = publicRoutes.includes(pathname);
  const { isLoggedIn, user } = await checkLogin(req);
  

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // اگر کاربر لاگین است و در صفحه لاگین است، به صفحه اصلی ریدایرکت کن
  if (isLoggedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  if(isLoggedIn && pathname === '/select-role' && user?.role) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if(isLoggedIn && pathname === '/' && !user?.role) {
    return NextResponse.redirect(new URL('/select-role', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};