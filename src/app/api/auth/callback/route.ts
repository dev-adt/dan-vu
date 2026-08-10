import { NextRequest, NextResponse } from 'next/server';
import { getSafeNextPath } from '@/lib/auth-redirect';

function getPublicOrigin(request: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  if (forwardedHost) {
    return `${forwardedProto.split(',')[0]}://${forwardedHost.split(',')[0]}`;
  }

  const host = request.headers.get('host');
  if (host) {
    return `${forwardedProto.split(',')[0]}://${host}`;
  }

  return new URL(request.url).origin;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = getSafeNextPath(requestUrl.searchParams.get('next'));
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  const redirectUrl = new URL('/auth/callback', getPublicOrigin(request));
  redirectUrl.searchParams.set('next', next);

  if (code) {
    redirectUrl.searchParams.set('code', code);
  }

  if (error) {
    redirectUrl.searchParams.set('error', error);
  }

  if (errorDescription) {
    redirectUrl.searchParams.set('error_description', errorDescription);
  }

  return NextResponse.redirect(redirectUrl);
}
