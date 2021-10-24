<template>
  <div class="StageEditTab">
    <el-button type="primary" @click="handleClickMenu">新增</el-button>
    <el-button type="danger" @click="handleDelMenu(selRows)">删除</el-button>
    <el-table
      :data="stageData"
      :span-method="spanMethod"
      @selection-change="handleTableSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection"></el-table-column>
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
      <el-table-column label="ID" prop="id" sortable min-width="50">
      </el-table-column>
      <el-table-column label="场景名称" prop="displayName" min-width="100">
      </el-table-column>
      <el-table-column label="场景模型ID" prop="envModelId"> </el-table-column>
      <el-table-column label="场景地图" prop="mapId"> </el-table-column>
      <el-table-column label="场景标签" prop="tagCode"> </el-table-column>
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
import EditMenu from "/@/views/stage/component/edit.vue";
import { useHandleDelMenu, useHandleTableSelectionChange } from "/@/views/util";
import { useMergeMethod } from "/@/hooks/mergeTableHook";
interface stageState {
  editMenuRef: any;
  stageData: stage[];
  selRows: [];
  mergeLineArr: number[];
}
export default {
  name: "StageEditTab",
  components: { EditMenu },
  setup() {
    const store = useStore();
    const state: stageState = reactive({
      editMenuRef: {},
      stageData: [],
      selRows: [],
      mergeLineArr: [],
    });
    watchEffect(() => {
      state.stageData = store.getters.getArrayData("stage");
    });

    const spanMethod = useMergeMethod(state.stageData, [
      { columnIndex: 1, spanArr: [], pos: 0, prop: "availableForCharacterId" },
      { columnIndex: 2, spanArr: [], pos: 0, prop: "section" },
    ]);
    const handleClickMenu = useHandleClickMenu(state);
    const getCharacterName = useGetCharacterName(store);
    const handleTableSelectionChange = useHandleTableSelectionChange(state);
    const handleDelMenu = useHandleDelMenu(store, "stage");
    return {
      ...toRefs(state),
      getCharacterName,
      spanMethod,
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
const useHandleClickMenu = (state: stageState) => (row: stage) => {
  state.editMenuRef.openDialog(row);
};
</script>

<style>
.StageEditTab {
  padding: 50px 50px 0 50px;
}
</style>
