/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_FACEBOOK_CLIENT_ID: string
  readonly VITE_ENOKI_API_KEY: string
  readonly VITE_FULLNODE_URL: string
  readonly VITE_ESCROW_PACKAGE_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
