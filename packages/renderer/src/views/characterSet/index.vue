<template>
  <div class="CharSetEditTab">
    <el-button type="primary" @click="handleClickMenu">新增</el-button>
    <el-button type="danger" @click="handleDelMenu(selRows)">删除</el-button>
    <el-table
      :data="charSetData"
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
      <el-table-column label="单位组标签" prop="tagCode"> </el-table-column>
      <el-table-column label="包含单位" prop="characterIds" min-width="120">
        <template #default="scope">
          <el-tag hit v-for="characterId in scope.row.characterIds">{{
            characters[characterId].displayName
          }}</el-tag>
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
import EditMenu from "/@/views/characterSet/component/edit.vue";
import { useHandleDelMenu, useHandleTableSelectionChange } from "/@/views/util";
interface charSetState {
  editMenuRef: any;
  charSetData: characterSet[];
  characters: { [key: string]: card };
  selRows: [];
}
export default {
  name: "CharSetEditTab",
  components: { EditMenu },
  setup() {
    const store = useStore();
    const state: charSetState = reactive({
      editMenuRef: {},
      charSetData: [],
      characters: store.state["characters"].data,
      selRows: [],
    });
    watchEffect(() => {
      state.charSetData = store.getters.getArrayData("characterSet");
    });
    const handleClickMenu = useHandleClickMenu(state);
    const getCharacterName = useGetCharacterName(store);
    const handleTableSelectionChange = useHandleTableSelectionChange(state);
    const handleDelMenu = useHandleDelMenu(store, "characterSet");
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
const useHandleClickMenu = (state: charSetState) => (row: characterSet) => {
  state.editMenuRef.openDialog(row);
};
</script>

<style>
.CharSetEditTab {
  padding: 50px 50px 0 50px;
}
</style>
