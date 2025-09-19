// app/sso/page.tsx
import Link from 'next/link';

export default function SSORedirectPage() {
  return (
      <main style={{ padding: 24 }}>
        <h1>Sign in with SSO</h1>
        <p>
          <a href="/api/sso/authorize" style={{ display: 'inline-block', padding: '8px 12px', background: '#111827', color: '#fff', borderRadius: 6 }}>
            Sign in with Identity Provider
          </a>
        </p>
      </main>
  );
}
