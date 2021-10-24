// @ts-ignore
import Service from "./Service";

export const service = {
  start: (isDebug: boolean) => {
    const service = new Service("service", isDebug);
    service.on("success", function () {
      console.log("service进程启动成功");
    });

    service.on("fail", function () {
      console.log("service进程启动异常");
    });

    service.on("closed", function () {
      console.log("service进程关闭");
    });

    service.on("crashed", function () {
      console.log("service进程崩溃");
    });

    return service;
  },
};
