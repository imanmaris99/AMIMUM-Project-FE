export interface ResetPasswordParams {
  email: string | null;
  code: string;
  hasCredentials: boolean;
}

type ResetLocation = Pick<Location, 'pathname' | 'search' | 'hash'>;
type ResetHistory = Pick<History, 'state' | 'replaceState'>;

export function readResetPasswordParams(search: string, hash = ''): ResetPasswordParams {
  const queryParams = new URLSearchParams(search);
  const fragmentParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
  const email = queryParams.get('email') ?? fragmentParams.get('email');
  const code = (queryParams.get('code') ?? fragmentParams.get('code') ?? '').trim();

  return { email, code, hasCredentials: Boolean(email || code) };
}

function removeCredentialParams(source: string, prefix: '?' | '#'): string {
  if (!source) return '';
  const rawParams = source.startsWith(prefix) ? source.slice(1) : source;
  const remaining = rawParams.split('&').filter((param) => {
    if (!param) return false;
    const rawKey = param.split('=', 1)[0];
    const key = new URLSearchParams(`${rawKey}=1`).keys().next().value;
    return key !== 'email' && key !== 'code';
  });
  return remaining.length ? `${prefix}${remaining.join('&')}` : '';
}

export function clearResetPasswordQuery(location: ResetLocation, history: ResetHistory): void {
  const search = location.search || '';
  const hash = location.hash || '';
  const queryParams = new URLSearchParams(search);
  const fragmentParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
  if (
    !queryParams.has('email') && !queryParams.has('code')
    && !fragmentParams.has('email') && !fragmentParams.has('code')
  ) return;

  history.replaceState(
    history.state,
    '',
    `${location.pathname}${removeCredentialParams(search, '?')}${removeCredentialParams(hash, '#')}`,
  );
}
