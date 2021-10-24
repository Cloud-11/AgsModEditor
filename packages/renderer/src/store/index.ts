import { createStore } from "vuex";
import { saveFile } from "/@/store/handle";
import {
  ADD_STATE_DATA,
  DELETE_BY_ID,
  INIT_STATE_DATA,
  MODIFIY_BY_ID,
} from "/@/store/actionType";
import {
  cards,
  cardSet,
  character,
  characterSet,
  cardCommand,
  level,
  stage,
  sound,
  music,
  grade,
  effect,
} from "/@/store/module";
import _ from "lodash";
import { toRaw } from "vue";
const noTagState = ["cards", "cardSet", "character", "characterSet"];
const store = createStore({
  state() {
    return {
      modInfo: {},
      unSaveState: [],
    };
  },
  modules: {
    cards,
    cardSet,
    character,
    characterSet,
    cardCommand,
    level,
    stage,
    sound,
    music,
    grade,
    effect,
  },

  getters: {
    getItemById: (state: any) => (name: string, id: string) => {
      return state[name].data[id];
    },
    getArrayItemById: (state: any) => (name: string, id: string) => {
      return Object.values(state[name].data[id]);
    },
    getItemsByTag: (state: any) => (name: string, tag: string) => {
      const data = state[name].tagType[tag].map((id: string) => {
        return state[name].data[id];
      });
      return Object.values(data);
    },
    getItemsByTags: (state: any) => (name: string, tags: string[]) => {
      let data: any[] = [];
      let ids: string[] = [];
      const stateData = state[name];
      tags.forEach((tag) => {
        stateData.tagType[tag]?.forEach((id: string) => {
          if (ids.indexOf(id) == -1) {
            data.push(stateData.data[id]);
            ids.push(id);
          }
        });
      });
      return data;
    },
    getItemsByNotTags: (state: any) => (name: string, notTags: string[]) => {
      let notIds: string[] = [];
      notTags.forEach((tag) => {
        if (tag != "" && state[name].tagType[tag] != undefined) {
          notIds.push(...state[name].tagType[tag]);
        }
      });
      notIds = Array.from(new Set(notIds));
      let item: any[] = [];
      Object.keys(state[name].data).forEach((id: string) => {
        if (notIds.indexOf(id) == -1) {
          item.push(state[name].data[id]);
        }
      });
      return item;
    },
    //获取所有tagcodes
    getTags: (state: any) => (name: string) => {
      return Object.keys(state[name].tagType);
    },
    getTagType: (state: any) => (name: string) => {
      return state[name].tagType;
    },
    getData: (state: any) => (name: string) => {
      return name == "modInfo" ? state[name] : state[name].data;
    },
    getArrayData: (state: any) => (name: string) => {
      return Object.values(state[name].data);
    },
    getState: (state: any) => (name: string) => {
      return state[name];
    },
  },
  actions: {
    [INIT_STATE_DATA]({ commit }, payload) {
      commit("initState", payload);
    },
    [ADD_STATE_DATA](
      { state, commit },
      payload: { name: string; id: string; data: any }
    ) {
      return new Promise((resolve, reject) => {
        console.log(payload);
        const item = state[payload.name].data[payload.id];
        if (item != undefined) {
          reject(`id:[${payload.id}] 已存在！`);
          return;
        }
        //备份
        const key = `ADD_STATE_DATA_${payload.name}_${Date.now()}`;
        localStorage.setItem(key, JSON.stringify(state[payload.name]));
        try {
          commit("addStateData", payload);
          if (noTagState.indexOf(payload.name) != -1) {
            commit("resetTags", {
              tagType: state[payload.name].tagType,
              id: payload.id,
              tagCode: state[payload.name].data[payload.id].tagCode,
            });
          }
        } catch (e) {
          //恢复
          commit("initState", {
            name: payload.name,
            data: JSON.parse(<string>localStorage.getItem(key)),
          });
          //清除备份
          localStorage.removeItem(key);
          reject(e);
          return;
        }
        //清除备份
        localStorage.removeItem(key);
        commit("addUnSave", payload.name);
        resolve("添加成功");
      });
    },
    [MODIFIY_BY_ID](
      { state, commit },
      payload: { name: string; id: string; data: any }
    ) {
      return new Promise((resolve, reject) => {
        const item = state[payload.name].data[payload.id];
        if (item == undefined) {
          reject(`id:[${payload.id}] 不存在！`);
          return;
        }
        //备份
        const key = `ADD_STATE_DATA_${payload.name}_${Date.now()}`;
        localStorage.setItem(key, JSON.stringify(state[payload.name]));
        try {
          //合并元素
          commit("modfiyData", {
            name: payload.name,
            id: payload.id,
            data: payload.data,
          });

          if (noTagState.indexOf(payload.name) != -1) {
            commit("resetTags", {
              tagType: state[payload.name].tagType,
              id: payload.id,
              tagCode: state[payload.name].data[payload.id].tagCode,
            });
          }
        } catch (e) {
          //恢复
          commit("initState", {
            name: payload.name,
            data: JSON.parse(<string>localStorage.getItem(key)),
          });
          //清除备份
          localStorage.removeItem(key);
          reject(e);
          return;
        }
        localStorage.removeItem(key);
        commit("addUnSave", payload.name);
        resolve("修改成功");
      });
    },
    [DELETE_BY_ID](
      { state, commit },
      payload: { name: string; id: string[] | string }
    ) {
      return new Promise((resolve, reject) => {
        const stateData = state[payload.name];
        let ids: string[];
        if (!payload.id) {
          reject("删除id不能为空!");
          return;
        }
        if (typeof payload.id === "string") {
          ids = [payload.id];
        } else {
          ids = payload.id;
        }
        //备份
        const key = `ADD_STATE_DATA_${payload.name}_${Date.now()}`;
        localStorage.setItem(key, JSON.stringify(state[payload.name]));
        try {
          ids.forEach((id) => {
            const item = stateData.data[id];
            let tagCode: string = stateData.data[id].tagCode;
            if (item != undefined) {
              commit("deleteDataById", { stateData, id });
              //删除包含id的tag
              if (stateData.tagType && tagCode) {
                commit("deleteTagById", {
                  tagCode,
                  tagType: stateData.tagType,
                  id,
                });
              }
            }
          });
        } catch (e) {
          //恢复
          commit("initState", {
            name: payload.name,
            data: JSON.parse(<string>localStorage.getItem(key)),
          });
          //清除备份
          localStorage.removeItem(key);
          reject(e);
          return;
        }
        localStorage.removeItem(key);
        commit("addUnSave", payload.name);
        resolve("删除成功!");
      });
    },
  },
  mutations: {
    initState(state: any, { data, name }: { name: string; data: any }) {
      state[name] = data;
    },
    addUnSave(state, name) {
      state.unSaveState.push(name);
    },
    removeUnSave(state, name) {
      const index = state.unSaveState.indexOf(name);
      index > -1 && state.unSaveState.splice(index, 1);
    },
    addStateData(
      state: any,
      { data, name }: { name: string; id: string; data: any }
    ) {
      state[name].data[data.id] = data;
    },
    resetTags(
      state: any,
      { id, tagCode, tagType }: { tagType: any; id: string; tagCode: string }
    ) {
      tagCode.split(";").forEach((tag: string) => {
        if (tagType[tag] != undefined) {
          console.log(tagType[tag]);
          tagType[tag].indexOf(id) == -1 && tagType[tag].push(id);
        } else {
          tagType[tag] = [id];
        }
      });
    },
    modfiyData(
      state: any,
      { data, id, name }: { name: string; id: string; data: any }
    ) {
      //合并元素
      state[name].data[id] = Object.assign(state[name].data[id], data);
    },
    deleteDataById(state, { stateData, id }) {
      delete stateData.data[id];
    },
    deleteTagById({ tagCode, tagType, id }) {
      tagCode.split(";").forEach((tag: string) => {
        const tags: string[] = tagType[tag];
        const index = tags.indexOf(id);
        index != -1 && tags.splice(index, 1);
        tags.length < 1 && delete tagType[tag];
      });
    },
  },
  plugins: [
    (store) => {
      //保存文件 action之后保存
      store.subscribeAction({
        after: (action, state) => {
          if (
            action.type === ADD_STATE_DATA ||
            action.type === MODIFIY_BY_ID ||
            action.type === DELETE_BY_ID
          ) {
            state.unSaveState.forEach(async (name: string) => {
              await saveFile(
                name,
                state.modInfo.path,
                _.cloneDeep(toRaw(state[name].data))
              ).then(() => {
                store.commit("removeUnSave", name);
              });
            });
          }
        },
      });
    },
  ],
});

export default store;
