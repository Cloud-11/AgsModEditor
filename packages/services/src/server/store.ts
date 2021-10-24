// import { Store } from "electron-store";
const Store = require("electron-store");
const store = new Store();

//全局db数据对象
//初始化
/**
 *设置配置文件
 * @param {String} name
 * @param {any} data
 */
const setConfig = (name: string, data: any) => {
  if (data != null || data != undefined) {
    store.set(name, data);
  }
};
/**
 * 获取数据
 * @param {String} name
 */
const getConfig = (name: string) => {
  return store.get(name);
};
export { getConfig, setConfig };
