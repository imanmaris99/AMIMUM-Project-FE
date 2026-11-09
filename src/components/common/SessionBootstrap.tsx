"use client";

import { useEffect } from 'react';
import { SessionManager, generateSecureToken } from '@/lib/auth';

export default function SessionBootstrap() {
  useEffect(() => {
    let active = true;
    const sessionRevision = SessionManager.captureSessionRevision();
    fetch('/api/auth/session', { credentials: 'same-origin', cache: 'no-store' })
      .then(async (response) => {
        if (response.status === 401 || response.status === 403) {
          if (active) await SessionManager.clearLocalSessionIfRevisionMatches(sessionRevision);
          return null;
        }
        if (!response.ok) return null;
        return response.json().catch(() => null);
      })
      .then(async (result) => {
        if (!active || !result?.profile) return;
        const { profile } = result;
        const data = profile?.data?.data ?? profile?.data ?? {};
        if (!data.email) return;
        const firstname = data.firstname || data.first_name || '';
        const lastname = data.lastname || data.last_name || '';
        await SessionManager.setSessionIfRevisionMatches({
          id: String(data.id || generateSecureToken()),
          email: String(data.email),
          name: `${firstname} ${lastname}`.trim() || String(data.email).split('@')[0],
          firstname: firstname || undefined,
          photoUrl: data.photo_url || undefined,
          role: data.role === 'admin' ? 'admin' : 'user',
          createdAt: data.created_at ? new Date(data.created_at) : new Date(),
          lastLogin: new Date(),
        }, sessionRevision);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);
  return null;
}
