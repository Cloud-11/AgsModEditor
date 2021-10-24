<template>
  <div class="LevelEditTab">
    <el-button type="primary" @click="handleClickMenu">新增</el-button>
    <el-button type="danger" @click="handleDelMenu(selRows)">删除</el-button>
    <el-table
      :data="levelData"
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
      <el-table-column label="关卡" prop="section" sortable> </el-table-column>
      <el-table-column label="关卡名称" prop="displayName" min-width="100">
      </el-table-column>
      <el-table-column label="通道场景数量" prop="passageStageCount">
      </el-table-column>
      <el-table-column label="分支场景数量" prop="branchStageCount">
      </el-table-column>
      <el-table-column label="禁止随机" prop="notAllowRandomizeStages">
      </el-table-column>
      <el-table-column label="场景地图" prop="mapId"> </el-table-column>
      <el-table-column label="场景大小(长,1,宽)" prop="stageSize">
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
import EditMenu from "/@/views/level/component/edit.vue";
import { useHandleDelMenu, useHandleTableSelectionChange } from "/@/views/util";
import { useMergeMethod } from "/@/hooks/mergeTableHook";

interface levelState {
  editMenuRef: any;
  levelData: level[];
  selRows: [];
}
export default {
  name: "LevelEditTab",
  components: { EditMenu },
  setup() {
    const store = useStore();
    const state: levelState = reactive({
      editMenuRef: {},
      levelData: [],
      selRows: [],
    });
    watchEffect(() => {
      state.levelData = store.getters.getArrayData("level");
    });
    const spanMethod = useMergeMethod(state.levelData, [
      { columnIndex: 1, spanArr: [], pos: 0, prop: "availableForCharacterId" },
    ]);
    const handleClickMenu = useHandleClickMenu(state);
    const getCharacterName = useGetCharacterName(store);
    const handleTableSelectionChange = useHandleTableSelectionChange(state);
    const handleDelMenu = useHandleDelMenu(store, "level");
    return {
      ...toRefs(state),
      spanMethod,
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
const useHandleClickMenu = (state: levelState) => (row: level) => {
  state.editMenuRef.openDialog(row);
};
</script>

<style>
.LevelEditTab {
  padding: 50px 50px 0 50px;
}
</style>
