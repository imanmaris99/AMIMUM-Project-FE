const STAGING_FIREBASE_PROJECT_ID = 'demo-amimum-staging';

export function connectFirebaseAuthEmulatorIfConfigured<T>(
  auth: T,
  host: string | undefined,
  projectId: string | undefined,
  connect: (auth: T, emulatorUrl: string) => void,
): boolean {
  const emulatorUrl = getFirebaseAuthEmulatorUrl(host, projectId);
  if (!emulatorUrl) return false;

  connect(auth, emulatorUrl);
  return true;
}

export function getFirebaseAuthEmulatorUrl(
  host: string | undefined,
  projectId: string | undefined,
): string | null {
  if (!host || host !== host.trim() || projectId !== STAGING_FIREBASE_PROJECT_ID) return null;

  const candidate = /^https?:\/\//i.test(host) ? host : `http://${host}`;
  try {
    const authority = candidate.match(/^https?:\/\/([^/?#]*)/i)?.[1];
    if (
      !authority ||
      authority.includes('@') ||
      candidate.includes('?') ||
      candidate.includes('#')
    ) return null;

    const url = new URL(candidate);
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.pathname !== '/' ||
      url.search ||
      url.hash
    ) return null;

    const rawHostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '');
    if (!rawHostname || rawHostname.endsWith('..')) return null;
    const hostname = rawHostname.replace(/\.$/, '');
    if (!hostname) return null;
    const loopback = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
    const productionFirebaseHost =
      hostname === 'identitytoolkit.googleapis.com' ||
      hostname === 'googleapis.com' ||
      hostname.endsWith('.googleapis.com') ||
      hostname === 'firebaseapp.com' ||
      hostname.endsWith('.firebaseapp.com') ||
      hostname === 'web.app' ||
      hostname.endsWith('.web.app');

    // Never point a browser at a publicly reachable Auth Emulator. It can expose
    // emulator accounts and bypass the staging-only boundary if a proxy is misconfigured.
    if (!loopback || productionFirebaseHost) return null;
    const normalizedHostname = hostname.includes(':') ? `[${hostname}]` : hostname;
    const port = url.port ? `:${url.port}` : '';
    return `${url.protocol}//${normalizedHostname}${port}`;
  } catch {
    return null;
  }
}
