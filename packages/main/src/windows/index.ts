import { BrowserWindow } from "electron";
import { join } from "path";
import { URL } from "url";
// @ts-ignore
import ipc from "/@/ipc/main";
const env = import.meta.env;
export default class {
  window: BrowserWindow | null;
  // iconPath: string;
  name: string;
  pageUrl: string;
  preloadPath: string;
  webContents: any;
  constructor() {
    this.window = null;
    this.name = "mainRender";
    // this.iconPath =
    //   process.env.NODE_ENV === "development"
    //     ? join(__dirname, "../main/resources/icons/icon.png")
    //     : join(__dirname, "../resources/icons/icon.png");
    // @ts-ignore
    this.pageUrl =
      env.MODE === "development"
        ? env.VITE_DEV_SERVER_URL
        : new URL(
            "../renderer/dist/index.html",
            "file://" + __dirname
          ).toString();
    this.preloadPath = join(__dirname, "../../preload/dist/index.cjs");
    // process.env.NODE_ENV === "development"
    //   ? path.join(__dirname, "./preload.js")
    //   : path.join(__dirname, "./preload.js");
  }
  init() {
    this.window = new BrowserWindow({
      // icon: this.iconPath,
      center: true,
      show: false, // Use 'ready-to-show' event to show window
      width: 753,
      height: 425,
      frame: false,
      resizable: true,
      maximizable: true,
      minimizable: true,
      webPreferences: {
        // preload: this.preloadPath,
        webSecurity: false,
        contextIsolation: false, // Spectron tests can't work with contextIsolation: true
        enableRemoteModule: true, // Spectron tests can't work with enableRemoteModule: false
        nodeIntegration: true,
      },
      // webPreferences: {
      //   preload: this.preloadPath,
      //   nodeIntegration: true,
      //   webSecurity: false,
      //   enableRemoteModule: true,
      //   contextIsolation: false,
      // }
    });
    // @ts-ignore
    this.window.windowId = this.name;
    ipc._register(this.name, this.window);
    this.window.on("ready-to-show", () => {
      this.window?.show();
      if (env.MODE === "development") {
        this.window?.webContents.openDevTools();
      }
    });

    this.window.on("closed", () => {
      this.window = null;
    });

    process.env.NODE_ENV === "development"
      ? this.window.loadURL(this.pageUrl)
      : this.window.loadFile(this.pageUrl);
  }
  toggle() {
    if (this.window === null) {
      this.init();
    } else if (this.window.isVisible()) {
      this.window.hide();
    } else {
      this.window.show();
      this.window.focus();
    }
  }
}
