interface ElectronApi {
  readonly versions: Readonly<NodeJS.ProcessVersions>;
  ipcRenderer: ipcRenderer;
}

declare interface Window {
  electron: Readonly<ElectronApi>;
  electronRequire?: NodeRequire;
}
