// @ts-ignore
import ipc from "./src/ipc";

import { getConfig, setConfig } from "./src/server/store";
import {
  readCsvFile,
  writeCsvFile,
  writeExcelFile,
  checkFile,
  getPackages,
  getPackageInfo,
} from "./src/server/file";
ipc.response("storeService/getConfig", (req, cb) => {
  cb(getConfig(req.key));
});
ipc.response("storeService/setConfig", (req, cb) => {
  setConfig(req.key, req.val);
});

ipc.response("fileServices/readCsvFile", async (req, cb) => {
  cb(await readCsvFile(req.path));
});
ipc.response("fileServices/writeCsvFile", async (req, cb) => {
  cb(await writeCsvFile(req.path, req.data, req.fields));
});

ipc.response("fileServices/writeExcelFile", (req, cb) => {
  cb(writeExcelFile(req.path, req.data));
});
ipc.response("fileServices/checkFile", (req, cb) => {
  cb(checkFile(req.path));
});
ipc.response("fileServices/getPackages", (req, cb) => {
  console.log(req);
  cb(getPackages(req.path));
});
ipc.response("fileServices/getPackageInfo", (req, cb) => {
  console.log(req);
  cb(getPackageInfo(req.path));
});
