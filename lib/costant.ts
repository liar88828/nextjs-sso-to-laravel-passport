export const config = {
    SSO_CLIENT_ID: process.env.SSO_CLIENT_ID ?? 'secret_uuid',
    SSO_CLIENT_SECRET: process.env.SSO_CLIENT_SECRET ?? 'secret_random',
    SSO_REDIRECT_URI: process.env.SSO_REDIRECT_URI ?? 'http://localhost:3000/api/sso/callback',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',

}