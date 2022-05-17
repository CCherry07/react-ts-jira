interface ImportMetaEnv {
  readonly VITE_REACT_APP_URL: string
  // 更多环境变量...
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
