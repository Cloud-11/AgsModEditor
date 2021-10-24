import type { BrowserWindow, App, IpcMainEvent } from "electron";

//根据名称隐藏页面
const setPage =
  (window: BrowserWindow) =>
  (event: IpcMainEvent, { method, args }: PageCommand) => {
    // @ts-ignore
    args ? window[method](...args) : window[method]();
    window.center();
  };

const closeApp = (app: App) => () => {
  app.quit();
};

export { closeApp, setPage };
