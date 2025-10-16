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

const publicRoutes = ['/login', '/select-role'];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublicRoute = publicRoutes.includes(pathname);
  const { isLoggedIn, user } = await checkLogin(req);
  

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // اگر کاربر لاگین است و در صفحه لاگین است، به صفحه اصلی ریدایرکت کن
  if (isLoggedIn && pathname === '/login') {
    if (!user?.role) {
      return NextResponse.redirect(new URL('/select-role', req.url));
    }
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  // اگر کاربر لاگین است و نقش دارد و در صفحه انتخاب نقش است
  if(isLoggedIn && pathname === '/select-role' && user?.role) {
    if (user.role === 'driver') {
      return NextResponse.redirect(new URL('/driver', req.url));
    }
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  // اگر کاربر لاگین است ولی نقش ندارد و در صفحه انتخاب نقش نیست
  if(isLoggedIn && !user?.role && pathname !== '/select-role') {
    return NextResponse.redirect(new URL('/select-role', req.url));
  }
  
  // اگر کاربر لاگین است و نقش راننده ندارد ولی در صفحه راننده است
  if(isLoggedIn && pathname === '/driver' && user?.role !== 'driver') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  // اگر کاربر لاگین است و در صفحه اصلی است ولی نقش راننده دارد
  if(isLoggedIn && pathname === '/' && user?.role === 'driver') {
    return NextResponse.redirect(new URL('/driver', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};