const fs = require("fs");
const { Parser } = require("json2csv");
const csv = require("csvtojson");
/**
 * 检查文件存在
 * @param {String} path
 */
const checkFile = (path: string) => {
  return fs.statSync(path);
};
/**
 * 获取全部包目录
 * @param {String} path
 */
const getPackages = (path: string) => {
  let jsonFiles: string[] = [];
  let files = fs.readdirSync(path);
  files.forEach(function (item: string) {
    const fPath = path + "\\" + item;
    let stat = fs.statSync(fPath);
    if (stat.isDirectory()) {
      jsonFiles.push(fPath);
    }
  });
  return jsonFiles;
};
/**
 * 获取包info文件信息
 * @param {String} path
 */
const getPackageInfo = (path: string): Msg => {
  let data: ModPackageInfo = {
    id: "",
    publishedId: "",
    netId: "",
    version: 0,
    displayName: "",
    description: "",
    isTrackingPlaytime: true,
    completionProgressPercent: 0,
    visibility: 0,
  };
  let info: ModPackageInfoData = {
    packageInfo: data,
    icon: { src: "" },
    path: path,
  };

  let datas: string = "";
  // info = {};
  try {
    datas = fs.readFileSync(path + "\\PackageInfo.json");
  } catch (error) {
    return {
      status: 0,
      msg: `文件读取出错\r\n ${error}`,
    };
  }
  data = JSON.parse(datas);
  console.log(data);
  info.packageInfo = data;
  // console.log(info);
  try {
    fs.statSync(path + "\\icon.png");
    info.icon = { src: path + "\\icon.png" };
  } catch (error) {
    info.icon = { src: "" };
  }
  return { status: 1, msg: `文件读取成功`, data: info };
};
/**
 * 读取CSV文件
 * @param {String} path
 */
const readCsvFile = async (path: string) => {
  let jsonArray;
  try {
    jsonArray = await csv().fromFile(path);
  } catch (error) {
    console.log(error);
    return { status: 0, msg: `${path} 文件读取出错\r\n ${error}` };
  }
  console.log(jsonArray);
  return { status: 1, msg: `文件读取成功`, data: jsonArray };
};
/**
 * 写入CSV文件
 * @param {String} path
 * @param data
 */
const writeCsvFile = async (path: string, data: []) => {
  try {
    //格式化转换fields
    const parser = new Parser();
    const csvData = parser.parse(data);
    //备份
    await fs.promises.copyFile(path, path + ".bak");
    //写文件
    await fs.promises.writeFile(path, csvData);
    return { status: 1, msg: "保存成功" };
  } catch (error) {
    console.error(error);
    return { status: 0, msg: "csv文件保存出错 error:" + error };
  }
};
/**
 * 写入Excel文件
 * @param {String} path
 * @param data
 */
const writeExcelFile = (path: string, data: {}) => {
  const timestamp = new Date().getTime();
  try {
    //原文件备份
    fs.copyFileSync(path, `${path}.${timestamp}.bak`);
  } catch (error) {
    return { status: 0, msg: "导出Excel文件出错 error:" + error };
  }
  return { status: 1, msg: "导出Excel文件成功" };
};
export {
  readCsvFile,
  writeCsvFile,
  writeExcelFile,
  checkFile,
  getPackages,
  getPackageInfo,
};
