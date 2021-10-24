import { app } from "electron";
import MainWindow from "/@/windows";
import IPCHandler from "/@/ipc/IPCHandler";
import { setPage, closeApp } from "/@/ipc/command";
import { service } from "/@/service";
const Store = require("electron-store");
const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

app.disableHardwareAcceleration();

/**
 * Workaround for TypeScript bug
 * @see https://github.com/microsoft/TypeScript/issues/41468#issuecomment-727543400
 */
const env = import.meta.env;

// Install "Vue.js devtools"
if (env.MODE === "development") {
  app
    .whenReady()
    .then(() => import("electron-devtools-installer"))
    .then(({ default: installExtension, VUEJS3_DEVTOOLS }) =>
      installExtension(VUEJS3_DEVTOOLS, {
        loadExtensionOptions: {
          allowFileAccess: true,
        },
      })
    )
    .catch((e) => console.error("Failed install extension:", e));
}

let mainWindow = new MainWindow();

app.on("second-instance", () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.window?.isMinimized()) mainWindow.window.restore();
    mainWindow.window?.focus();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  mainWindow.toggle();
});

app
  .whenReady()
  .then(() => {
    //初始化 electron-store initrender 获取存储路径
    Store.initRenderer();
    // 启动服务进程
    service.start(false).on("success", function () {
      mainWindow.init();
      //注册ipc消息
      new IPCHandler([
        {
          name: "setPage",
          callback: setPage(<Electron.BrowserWindow>mainWindow.window),
        },
        {
          name: "quit",
          callback: closeApp(app),
        },
      ]);
    });
  })
  .catch((e) => console.error("Failed create window:", e));

// Auto-updates
if (env.PROD) {
  app
    .whenReady()
    .then(() => import("electron-updater"))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error("Failed check updates:", e));
}
