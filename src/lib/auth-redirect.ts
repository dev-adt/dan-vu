export function getBrowserSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (typeof window === 'undefined') {
    return configuredUrl || '';
  }

  const currentOrigin = window.location.origin;
  const currentHost = window.location.hostname;

  if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
    return currentOrigin;
  }

  return configuredUrl || currentOrigin;
}

export function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/vote';
  }

  return value;
}
