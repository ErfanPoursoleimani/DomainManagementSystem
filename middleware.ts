import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextRequest, NextResponse } from "next/server";

let locales = ['en', 'de', 'fa', 'ar']

// Get the preferred locale
function getLocale(request: NextRequest) {
  let headers = { 'accept-language': request.headers.get('accept-language') || 'en' }
  let languages = new Negotiator({ headers }).languages()
  let defaultLocale = 'en'
  return match(languages, locales, defaultLocale);
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const domain = url.origin
  const { pathname } = request.nextUrl

  // Early return for API routes to prevent any processing
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  let locale = getLocale(request)
  if (!pathnameHasLocale) {
    // Redirect if there is no locale
    locale = getLocale(request)
    request.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(request.nextUrl)
  }

  // Extract current locale from pathname
  const currentLocale = locales.find(locale => 
    pathname.startsWith(`/${locale}`)
  )
  
  let response = NextResponse.next()

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - files with extensions (like .js, .css, .png, etc.)
     */
    '/((?!api/|_next/static|_next/image|favicon.ico|public/|.*\\.).*)',
  ],
}

// export const runtime = 'nodejs'