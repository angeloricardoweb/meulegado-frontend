import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Rotas que precisam de autenticação
  const protectedRoutes = ['/administracao', '/destinatarios', '/cofres', '/cofre', '/criar-cofre', '/criar-cofre-conteudo', '/criar-cofre-finalizar', '/perfil'];
  
  // Rotas de autenticação (redirecionar se já estiver logado)
  const authRoutes = ['/login', '/cadastro', '/recuperar-senha'];

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Verificar se é uma rota de autenticação
  const isAuthRoute = authRoutes.includes(pathname);

  // Se for rota protegida e não tiver token, redirecionar para login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se for rota de autenticação e tiver token, redirecionar para dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
