/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PANNA_CLIENT_ID: string
  readonly VITE_PANNA_PARTNER_ID: string
  readonly VITE_CHAIN_ID: string
  readonly VITE_INNCHAIN_CONTRACT: string
  readonly VITE_USDC_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
