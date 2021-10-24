import { fileServices } from "/@/utils";
import { ElMessage } from "element-plus";
import { Store } from "vuex";
import { INIT_STATE_DATA } from "/@/store/actionType";

const filesMap = [
  { fileName: "Cardset.csv", storeName: "cardSet" },
  { fileName: "Card.csv", storeName: "cards" },
  { fileName: "Character.csv", storeName: "characters" },
  { fileName: "CharacterSet.csv", storeName: "characterSet" },
  { fileName: "Level.csv", storeName: "level" },
  { fileName: "Stage.csv", storeName: "stage" },
  { fileName: "Sound.csv", storeName: "sound" },
  { fileName: "Music.csv", storeName: "music" },
  { fileName: "Grade.csv", storeName: "grade" },
  { fileName: "Effect.csv", storeName: "effect" },
  { fileName: "CardCommand.csv", storeName: "cardCommand" },
];
//处理对象属性
const initStoreDataHandle = (name: string, csvData: any) => {
  // let jsonstr = JSON.stringify(csvData).replaceAll("True", true);
  // csvData = JSON.parse(jsonstr);
  let data: any = {};
  let tagType: any = {};
  if (csvData instanceof Array) {
    csvData.forEach((obj, index) => {
      let cardIds: any[] = [];
      let initialRunCardIds: any[] = [];
      let characterIds: any[] = [];
      if (obj.id == undefined || obj.id == "") {
        csvData.splice(index, 1);
        return;
      }
      if (new RegExp("^//").test(obj.id)) {
        csvData.splice(index, 1);
        return;
      }
      obj.tagCode?.split(";").map((tag: string) => {
        if (tag != undefined && tag != "") {
          if (tagType[tag] == undefined || tagType[tag] == null) {
            tagType[tag] = [];
          }
          tagType[tag].push(obj.id);
        }
      });
      Object.keys(obj).forEach((key) => {
        if (!obj[key]) {
          delete obj[key];
        } else {
          switch (name) {
            case "cardSet":
              if (new RegExp("cardId\\d{1,3}$").test(key)) {
                cardIds.push(obj[key]);
                delete obj[key];
              }
              break;
            case "characters":
              if (new RegExp("initialRunCardId\\d{1,3}$").test(key)) {
                initialRunCardIds.push(obj[key]);
                delete obj[key];
              } else {
                if (new RegExp("cardId\\d{1,3}$").test(key)) {
                  cardIds.push(obj[key]);
                  delete obj[key];
                }
              }
              break;
            case "characterSet":
              if (new RegExp("characterId\\d{1,3}$").test(key)) {
                characterIds.push(obj[key]);
                delete obj[key];
              }
              break;
            case "level":
              if (new RegExp("notAllowRandomizeStages").test(key)) {
                if (obj[key]) {
                  obj[key].toLowerCase() == "true"
                    ? (obj[key] = true)
                    : (obj[key] = false);
                }
              }
              break;
            case "stage":
              if (new RegExp("characterCount_").test(key)) {
                if (obj[key]) {
                  obj["fieldCode"] = `${obj["fieldCode"] ? ";" : ""}${key}:${
                    obj[key]
                  }`;
                }
              }
              break;
          }
        }
      });
      if (cardIds.length > 0) obj.cardIds = cardIds;
      if (initialRunCardIds.length > 0)
        obj.initialRunCardIds = initialRunCardIds;
      if (characterIds.length > 0) obj.characterIds = characterIds;
      data[obj.id] = obj;
    });
  }
  return { data, tagType };
};
const initStoreData = (store: Store<any>, path: string) => {
  path = path + "\\Database\\";
  filesMap.map(async ({ fileName, storeName }) => {
    let { status, msg, data } = await fileServices.readCsvFile(path + fileName);
    if (status == 0) {
      ElMessage({
        showClose: true,
        message: msg,
        type: "error",
      });
    } else {
      if (data != null) {
        data = initStoreDataHandle(storeName, data);
        await store.dispatch(INIT_STATE_DATA, { name: storeName, data });
      }
    }
  });
};
//保存文件
const saveFile = async (name: string, path: string, data: any) => {
  let dataArr = Object.values(data);
  const { fileName } = filesMap.filter(({ storeName }) => {
    return storeName == name;
  })[0];
  let fields: string[] = [];
  //格式化数据,数组展开
  const dataKeyFormat = (keys: string[]) => {
    const foramt = (item: any, key: string) => {
      const len = item[key + "s"].length;
      for (let i = 0; i < len; i++) {
        item[key + i] = item[key + "s"][i];
      }
      delete item[key + "s"];
    };
    dataArr.forEach((item: any) => {
      keys.length < 2
        ? foramt(item, keys[0])
        : keys.forEach((key) => foramt(item, key));
      fields.push(...new Set<string>(...Object.keys(item)));
    });
  };
  //获取列名
  const defaultFileds = () => {
    dataArr.forEach((item: any) => {
      fields.push(...new Set<string>(...Object.keys(item)));
    });
  };
  //内容格式化
  switch (name) {
    case "cardSet":
      dataKeyFormat(["cardId"]);
      break;
    case "characters":
      dataKeyFormat(["initialRunCardId", "cardId"]);
      break;
    case "characterSet":
      dataKeyFormat(["characterId"]);
      break;
    default:
      defaultFileds();
  }
  console.log(dataArr);
  let { status, msg } = await fileServices.writeCsvFile(
    path + "\\Database\\" + fileName,
    dataArr,
    fields
  );
  ElMessage({
    showClose: true,
    message: msg,
    type: status == 0 ? "error" : "success",
  });
};
export { initStoreData, saveFile };
