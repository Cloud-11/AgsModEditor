<template>
  <div>
    <div id="edit">
      <el-row>
        <TitleBar :title="modInfo.packageInfo.displayName"></TitleBar>
      </el-row>
      <el-row type="flex">
        <el-col :span="5" class="left">
          <el-menu
            style="height: 100%"
            :default-active="selectedKeys"
            :default-openeds="openKeys"
            menu-trigger="click"
            @select="handleMenuSelect"
          >
            <template v-for="item in Menus">
              <SubMenu
                v-if="item.children?.length > 0"
                :parent-item="item"
              ></SubMenu>
              <el-menu-item v-else :index="item.name">{{
                item.title
              }}</el-menu-item>
            </template>
          </el-menu>
        </el-col>
        <el-col :span="19" class="right">
          <el-tabs
            v-model="activeKey"
            type="card"
            stretch
            closable
            @tab-click="tabClick"
            @tab-remove="removePane"
          >
            <el-tab-pane
              class="tabWindow"
              v-for="pane in panes"
              :key="pane.key"
              :label="pane.title"
              :name="pane.key"
              ><el-scrollbar :height="clientHights">
                <component
                  :paneData="getCurrentPaneData(pane.type)"
                  :is="pane.type"
                  style="padding-bottom: 100px"
                ></component
              ></el-scrollbar>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import TitleBar from "/@/components/TitleBar.vue";
import CardEditTab from "/@/views/card/index.vue";
import CardsEditTab from "/@/views/cards/index.vue";
import CardSetEditTab from "/@/views/cardSet/index.vue";
import CharEditTab from "/@/views/character/index.vue";
import CharsEditTab from "/@/views/characters/index.vue";
import CharSetEditTab from "/@/views/characterSet/index.vue";
import LevelEditTab from "/@/views/level/index.vue";
import StageEditTab from "/@/views/stage/index.vue";
import SubMenu from "/@/components/SubMenu.vue";
import ModInfoTab from "/@/views/modInfo/index.vue";
import Menus from "/@/static/menu.json";
import { useWinResize } from "/@/hooks/windowEventHooks";
import { computed, onMounted, reactive, Ref, toRefs } from "vue";
import { useStore } from "vuex";
import { initStoreData } from "/@/store/handle";
interface editState {
  selectedKeys: string;
  openKeys: string[];
  clientHights: string;
  activeKey: string;
  panes: tabPaneData[];
  modInfo: ModPackageInfoData;
}
export default {
  name: "edit",
  expose: ["addCardPane"],
  components: {
    TitleBar,
    CardEditTab,
    CardsEditTab,
    CardSetEditTab,
    CharEditTab,
    CharsEditTab,
    CharSetEditTab,
    LevelEditTab,
    StageEditTab,
    ModInfoTab,
    SubMenu,
  },
  setup() {
    const store = useStore();
    //数据初始化
    const state: editState = reactive({
      clientHights: useClientHeight(useWinResize(600)),
      selectedKeys: "baseInfo",
      openKeys: ["mod"],
      modInfo: computed(
        (): ModPackageInfoData => store.getters.getData("modInfo")
      ),
      activeKey: "baseInfo",
      panes: [
        {
          index: "baseInfo",
          key: "baseInfo",
          title: "基础信息",
          type: "ModInfoTab",
        },
      ],
    });

    //面板管理
    const { removePane, addPane } = panesManage(state);
    // const { activeKey, panes, onEdit, addPane } = menuManage();
    //菜单控制
    const handleMenuSelect = useMenuSelect(state, addPane);
    //tab 映射菜单
    const tabClick = usetabClick(state);
    //根据面板返回不同的props参数对象
    const getCurrentPaneData = useGetCurrentPaneData(state);
    onMounted(() => {
      initStoreData(store, state.modInfo.path);
    });

    return {
      ...toRefs(state),
      handleMenuSelect,
      Menus,
      tabClick,
      removePane,
      addPane,
      getCurrentPaneData,
    };
  },
};

//编辑面板映射
const menuEditPaneMap = new Map([
  ["baseInfo", { key: "baseInfo", title: "基础信息", type: "ModInfoTab" }],
  ["cardSet", { key: "cardSet", title: "卡牌组", type: "CardSetEditTab" }],
  ["normal", { key: "normal", title: "普通卡牌", type: "CardsEditTab" }],
  ["buff", { key: "buff", title: "BUFF卡牌", type: "CardsEditTab" }],
  ["equipment", { key: "equipment", title: "装备卡牌", type: "CardsEditTab" }],
  ["prop", { key: "prop", title: "道具", type: "CardsEditTab" }],
  ["card", { key: "card-${id}", title: "卡牌", type: "CardEditTab" }],
  ["charSet", { key: "charSet", title: "单位组", type: "CharSetEditTab" }],
  ["roleChars", { key: "roleChars", title: "角色单位", type: "CharsEditTab" }],
  ["wordChars", { key: "wordChars", title: "环境物体", type: "CharsEditTab" }],
  ["character", { key: "char-${id}", title: "单位", type: "CharEditTab" }],
  ["levelView", { key: "levelView", title: "关卡总览", type: "LevelEditTab" }],
  ["stageView", { key: "stageView", title: "场景总览", type: "StageEditTab" }],
]);
//给不同面板传参
const useGetCurrentPaneData = (state: editState) => (paneType: string) => {
  const { panes } = state;
  const { activeKey } = toRefs(state);
  switch (paneType) {
    case "CardsEditTab":
    case "CharsEditTab":
      return { panes, activeKey };
    case "CardEditTab":
    case "CharEditTab":
      return { id: state.activeKey };
  }
};
const usetabClick = (state: editState) => (tabPane) => {
  state.selectedKeys = tabPane.paneName;
};
//菜单选择
//index 是菜单的唯一   key是tab的唯一
//key 比菜单多   index 和key是一一对应的
// 但多的key没有index 对应

const useMenuSelect =
  (state: editState, addPane: (pane: tabPaneData) => void) =>
  (index: string) => {
    state.selectedKeys = index;
    for (let i = 0; i < state.panes.length; i++) {
      if (index === state.panes[i].index) {
        state.activeKey = index;
        return;
      }
    }
    if (menuEditPaneMap.get(index) != undefined) {
      addPane({
        index,
        ...(menuEditPaneMap.get(index) as {
          key: string;
          title: string;
          type: string;
        }),
      });
    }
  };

//程序窗口加单位
const useClientHeight = (clientHight: Ref<number>) =>
  computed(() => {
    return clientHight.value - 30 + "px";
  });
//tabs管理
const panesManage = (state: editState) => {
  const addPane = (pane: tabPaneData) => {
    state.panes.push(pane);
    state.activeKey = pane.key;
  };
  const removePane = (targetKey: string) => {
    let lastIndex = 0;
    state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
        return;
      }
    });
    state.panes.splice(lastIndex + 1, 1);
    // panesVal = panesVal.filter((pane) => pane.key !== targetKey);
    if (state.panes.length && state.activeKey === targetKey) {
      if (lastIndex >= 0) {
        state.activeKey = state.panes[lastIndex].key;
      } else {
        state.activeKey = state.panes[0].key;
      }
    }
  };
  const onEdit = (targetKey: string, action: string) => {
    if ("remove" == action) {
      removePane(targetKey);
    }
  };
  return {
    removePane,
    //onEdit,
    addPane,
  };
};
</script>

<style>
#edit {
  margin: 0;
  overflow: hidden;
  height: 100%;
}

#edit .left {
  padding-top: 3px;
  box-shadow: 2px 3px 5px 1px #e8e8e8;
  text-align: left;
}
#edit .left,
#edit .right {
  text-align: left;
  height: v-bind(clientHights);
  min-height: 600px;
}
#edit .left ul:first-child {
  height: v-bind(clientHights);
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 100px;
}
#edit .left > ul::-webkit-scrollbar,
#edit .left::-webkit-scrollbar,
#edit .right::-webkit-scrollbar {
  width: 0;
  display: none;
}
.el-tabs--card > .el-tabs__header {
  box-shadow: 0 1px 3px 0 #e8e8e8;
}
</style>
