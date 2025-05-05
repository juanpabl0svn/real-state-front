// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { intlMiddleware } from './middlewares/i18n';
import { handleAuthMiddleware } from './middlewares/auth';

export async function middleware(req: NextRequest) {
  // 1. Ejecutar i18n
  const intlResponse = intlMiddleware(req);

  // 2. Si next-intl respondió con una redirección u otra respuesta, seguimos desde ahí
  if (intlResponse instanceof NextResponse) {
    const authResponse = await handleAuthMiddleware(req);
    return authResponse ?? intlResponse;
  }

  return intlResponse;
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)', // Excluir paths internos
  ],
};
