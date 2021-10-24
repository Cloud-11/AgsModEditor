<template>
  <div class="CardsEditTab">
    <el-button type="primary" @click="handleClickMenu('newCard')"
      >新增</el-button
    >
    <el-button type="danger" @click="handleDelMenu(selRows)">删除</el-button>
    <el-table
      :data="cardsData"
      @selection-change="handleTableSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="卡牌ID" prop="id" sortable min-width="120">
      </el-table-column>
      <el-table-column label="卡牌名称" prop="displayName" min-width="100">
      </el-table-column>
      <!--      <el-table-column label="能量" prop="energyReq" min-width="50">-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="价格" prop="price" min-width="50" />-->
      <!--      <el-table-column label="射程" prop="range" min-width="50" />-->
      <el-table-column label="标签" prop="tagCode" min-width="80" />
      <el-table-column label="描述" prop="description" min-width="120" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button size="mini" type="primary" @click="handleClickMenu(row)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--    <EditMenu ref="editMenuRef" />-->
  </div>
</template>

<script lang="ts">
import { Store, useStore } from "vuex";
import { computed, reactive, Ref, toRefs } from "vue";
import { useHandleDelMenu, useHandleTableSelectionChange } from "/@/views/util";
interface cardsState {
  cardsData: card[];
  selRows: defaultDataType[];
}
export default {
  name: "CardsEditTab",
  props: ["paneData"],
  setup(props: { paneData: { panes: any; activeKey: Ref<string> } }) {
    const { panes, activeKey } = props.paneData;
    const active = activeKey.value;
    const tags = {
      buffCards: ["PosiBuff", "Debuff"],
      equipmentCards: ["Equipment"],
      propCards: ["Prop"],
    };
    let getData = (): card[] =>
      store.getters.getItemsByNotTags("cards", [
        "PosiBuff",
        "Debuff",
        "Equipment",
        "Prop",
      ]);
    if (Reflect.get(tags, active)) {
      getData = (): card[] =>
        store.getters.getItemsByTags("cards", Reflect.get(tags, active));
    }
    const store = useStore();
    const state: cardsState = reactive({
      cardsData: computed(getData),
      selRows: [],
    });
    //新增 编辑
    const handleClickMenu = useHandleClickMenu(state, panes, activeKey);
    //列表多选
    const handleTableSelectionChange = useHandleTableSelectionChange(state);
    //删除按钮
    const handleDelMenu = useHandleDelMenu(store, "cards");
    return {
      ...toRefs(state),
      handleTableSelectionChange,
      handleClickMenu,
      handleDelMenu,
    };
  },
};
//获取角色
const useGetCharacterName = (store: Store<any>) => (id: string) => {
  let character = store.getters.getItemById("characters", id);
  return character?.displayName || id + "(角色不存在)";
};
//新增 编辑 按钮handle
const useHandleClickMenu =
  (state: cardsState, panes: tabPaneData[], activeKey: Ref<string>) =>
  (row: card | string = "newCard") => {
    if (row == "newCard") {
      addCardPane(panes, activeKey, row, "新建");
    } else {
      addCardPane(
        panes,
        activeKey,
        (row as card).id,
        (row as card).displayName
      );
    }
  };
//卡牌tabpaneadd
const addCardPane = (
  panes: tabPaneData[],
  activeKey: Ref<string>,
  cardId: string,
  cardName: string
) => {
  const newPane = {
    index: "card",
    key: `card-${cardId}`,
    title: `${cardName}[${cardId}]-卡牌`,
    type: "CardEditTab",
  };
  const hasPane = panes.filter((pane) => {
    return pane.key == newPane.key;
  });
  if (hasPane == undefined || hasPane.length == 0) {
    panes.push(newPane);
  }
  activeKey.value = `card-${cardId}`;
};
</script>

<style>
.CardsEditTab {
  padding: 50px 50px 0 50px;
}
</style>
