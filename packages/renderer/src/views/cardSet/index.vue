<template>
  <div class="CardSetEditTab">
    <el-button type="primary" @click="handleClickMenu">新增</el-button>
    <el-button type="danger" @click="handleDelMenu(selRows)">删除</el-button>
    <el-table
      :data="cardSetData"
      @selection-change="handleTableSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="ID" prop="id" sortable min-width="50">
      </el-table-column>
      <el-table-column label="名称" prop="displayName" min-width="100">
      </el-table-column>
      <el-table-column label="所属主角(章节)" min-width="100"
        ><template #default="scope">
          <span>{{
            scope.row.availableForCharacterId === "Shared"
              ? "所有角色"
              : scope.row.availableForCharacterId === undefined
              ? "默认"
              : getCharacterName(scope.row.availableForCharacterId)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属关卡" prop="section"> </el-table-column>
      <el-table-column label="卡牌组标签" prop="tagCode"> </el-table-column>
      <el-table-column label="包含卡牌" prop="cardIds" min-width="120">
        <template #default="scope">
          <el-tag
            hit
            :type="
              cards[cardId].price > 8
                ? 'warning'
                : cards[cardId].price > 5
                ? 'danger'
                : cards[cardId].price > 3
                ? ''
                : 'success'
            "
            v-for="cardId in scope.row.cardIds"
            >{{ cards[cardId].displayName }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button size="mini" type="primary" @click="handleClickMenu(row)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <EditMenu ref="editMenuRef" />
  </div>
</template>

<script lang="ts">
import { Store, useStore } from "vuex";
import { reactive, toRefs, watchEffect } from "vue";
import EditMenu from "/@/views/cardSet/component/edit.vue";
import { useHandleDelMenu, useHandleTableSelectionChange } from "/@/views/util";
interface cardSetState {
  editMenuRef: any;
  cardSetData: cardSet[];
  cards: { [key: string]: card };
  selRows: [];
}
export default {
  name: "CardSetEditTab",
  components: { EditMenu },
  setup() {
    const store = useStore();
    const state: cardSetState = reactive({
      editMenuRef: {},
      cardSetData: [],
      cards: store.state["cards"].data,
      selRows: [],
    });
    watchEffect(() => {
      state.cardSetData = store.getters.getArrayData("cardSet");
      console.log(state.cardSetData);
    });

    const handleClickMenu = useHandleClickMenu(state);
    const getCharacterName = useGetCharacterName(store);
    const handleTableSelectionChange = useHandleTableSelectionChange(state);
    const handleDelMenu = useHandleDelMenu(store, "cardSet");
    return {
      ...toRefs(state),
      getCharacterName,
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
const useHandleClickMenu = (state: cardSetState) => (row: cardSet) => {
  state.editMenuRef.openDialog(row);
};
</script>

<style>
.CardSetEditTab {
  padding: 50px 50px 0 50px;
}
</style>
