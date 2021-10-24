import { URL } from "url";
const { BrowserWindow } = require("electron");
import ipc from "/@/ipc/main";
const Events = require("events");

class Service extends Events {
  constructor(name: string, isDebug = false) {
    super();
    this.name = name;
    this.bs = null;
    this.start(isDebug);
  }

  start(isDebug) {
    if (this.bs) {
      return false;
    }

    try {
      //TODO 服务进程 执行 分开
      const pageUrl = new URL(
        "../services/dist/index.html",
        "file://" + __dirname
      ).toString();
      console.log(pageUrl);
      this.bs = new BrowserWindow({
        show: false,
        fullscreen: false,
        skipTaskbar: false,
        webPreferences: {
          nodeIntegration: true,
          enableRemoteModule: true,
          contextIsolation: false,
        },
      });

      ipc._register(this.name, this.bs);

      this.bs.windowId = this.name;

      this.bs.on("closed", () => {
        this.emit("closed");
        this.bs = null;
        // windowCenter._unegister(this.name);
        ipc._unregister(this.name);
      });

      this.bs.on("ready-to-show", () => {
        if (isDebug) {
          this.bs.show();
          this.bs.webContents.openDevTools();
        } else {
          this.bs.setFocusable(false);
          this.bs.setIgnoreMouseEvents(true);
        }
        this.emit("success");
      });
      this.bs.loadURL(pageUrl);
      this.bs.webContents.on("crashed", () => {
        this.emit("crashed");
      });
      // windowCenter._register(this.name, this);
    } catch (error) {
      console.log(error);
      this.emit("fail");
    }
  }

  stop() {
    this.bs.close();
    this.bs = null;
  }
}

export default Service;
