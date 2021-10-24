import { IpcMainEvent } from "electron";

const { ipcMain } = require("electron");

class IPCHandler {
  constructor(routers: IpcRoute[]) {
    routers.forEach((route: IpcRoute) => {
      ipcMain.on(route.name, (event: IpcMainEvent, data: PageCommand) => {
        console.log(
          `接收指令：${data?.method ? data.method : route.name} 参数:${
            data?.args
          }`
        );
        route.callback(event, data);
      });
    });
  }
}
export default IPCHandler;
