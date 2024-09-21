import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // TODO: Active BASIC AUTH
  //   const basicAuth = request.headers.get('authorization');
  //   if (basicAuth) {
  //     const authValue = basicAuth.split(' ')[1];
  //     const [username, password] = atob(authValue).split(':');
  //     if (username === 'admin' && password === 'admin') {
  //       return NextResponse.next();
  //     }
  //   }

  //   const response = new NextResponse(null, { status: 401 });
  //   response.headers.append('WWW-Authenticate', 'Basic realm="Secure Area"');
  //   return response;
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|apple-icon.png|manifest.webmanifest).*)'],
};
