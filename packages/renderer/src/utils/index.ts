const { ipcRenderer, remote } = require("electron");
// import { ipcRenderer, remote } from "electron";
// const ipcRenderer = require("electron").ipcRenderer;
// const remote = require("electron").remote;
// @ts-ignore
import ipc from "/@/ipc";

const HOME_PATH = remote.app.getPath("home");

const setPage = (method: string, args?: {}): void => {
  ipcRenderer.send("setPage", {
    method,
    args,
  });
};

const newPage = (size: [number, number], func: Function): void => {
  setPage("hide");
  setPage("setSize", size);
  func(() => setPage("show"));
};

const closeWindow = (): void => {
  ipcRenderer.send("setPage", {
    method: "close",
  });
};
const quit = (): void => {
  ipcRenderer.send("quit");
};
const maxWindow = (isMaximize: boolean): void => {
  ipcRenderer.send("setPage", {
    method: isMaximize ? "unmaximize" : "maximize",
  });
  //手动触发窗口大小事件
  const resizeEvent = new Event("resize");
  window.dispatchEvent(resizeEvent);
  // console.log("resize事件手动触发" + resizeEvent);
};
const miniWindow = (): void => {
  ipcRenderer.send("setPage", {
    method: "minimize",
    args: [],
  });
};

const fileServices = {
  readCsvFile: (path: string) =>
    ipc.request("service", "fileServices/readCsvFile", {
      path,
    }),
  writeCsvFile: (path: string, data: any, fields: string[]) =>
    ipc.request("service", "fileServices/writeCsvFile", {
      path,
      data,
      fields,
    }),
  writeExcelFile: (path: string, data: object) =>
    ipc.request("service", "fileServices/writeExcelFile", {
      path,
      data,
    }),
  checkFile: (path: string) =>
    ipc.request("service", "fileServices/checkFile", {
      path,
    }),
  getPackages: (path: string) =>
    ipc.request("service", "fileServices/getPackages", {
      path,
    }),
  getPackageInfo: (path: string) =>
    ipc.request("service", "fileServices/getPackageInfo", {
      path,
    }),
};

const storeService = {
  getConfig: (key: string) =>
    ipc.request("service", "storeService/getConfig", {
      key,
    }),
  setConfig: (key: string, val: string) =>
    ipc.request("service", "storeService/setConfig", {
      key,
      val,
    }),
};

export {
  setPage,
  newPage,
  quit,
  maxWindow,
  closeWindow,
  miniWindow,
  storeService,
  fileServices,
  HOME_PATH,
};
