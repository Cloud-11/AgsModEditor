<template>
  <el-dialog
    title="新增/修改"
    v-model="isShowDialog"
    width="600px"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-scrollbar height="50vh">
      <el-form
        size="mini"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        label-suffix="："
      >
        <el-form-item label="ID" prop="id">
          <el-col :span="24">
            <el-input v-model="ruleForm.id"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="关卡" prop="section">
          <el-col :span="24">
            <el-input v-model="ruleForm.section"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="关卡名称" prop="displayName">
          <el-col :span="24">
            <el-input v-model="ruleForm.displayName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="所属主角(章节)" prop="availableForCharacterId">
          <el-select
            size="mini"
            v-model="ruleForm.availableForCharacterId"
            placeholder="请选择所属主角(章节)"
          >
            <el-option
              v-for="character in mainCharacter"
              :key="character.id"
              :label="character.id + ' ' + character.displayName"
              :value="character.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道场景数量" prop="passageStageCount">
          <el-col :span="24">
            <el-input v-model="ruleForm.passageStageCount"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="分支场景数量" prop="branchStageCount">
          <el-col :span="24">
            <el-input v-model="ruleForm.branchStageCount"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="禁止随机" prop="notAllowRandomizeStages">
          <el-switch
            v-model="ruleForm.notAllowRandomizeStages"
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
        <el-form-item label="场景地图ID" prop="mapId">
          <el-input v-model="ruleForm.mapId"></el-input>
        </el-form-item>
        <el-form-item label="场景大小(长,1,宽)" prop="stageSize">
          <el-input v-model="ruleForm.stageSize"></el-input>
        </el-form-item>
      </el-form> </el-scrollbar
    ><template #footer
      ><el-button type="primary" size="small" @click="onSubmit">提交</el-button>
      <el-button type="danger" size="small" @click="onCancel"
        >取消</el-button
      ></template
    >
  </el-dialog>
</template>
<script lang="ts">
import { computed, reactive, toRaw, toRefs, watchEffect } from "vue";
import _ from "lodash";
import { ADD_STATE_DATA, MODIFIY_BY_ID } from "/@/store/actionType";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
export default {
  name: "cardSetEditMenu",
  setup() {
    const store = useStore();
    type LevelDialogState = {
      isShowDialog: boolean;
      isEdit: boolean;
      ruleForm: level;
      mainCharacter: character[];
    };
    const state: LevelDialogState = reactive({
      isShowDialog: false,
      isEdit: false,
      ruleForm: {
        id: "",
        displayName: "",
        section: "",
        availableForCharacterId: "Default",
        passageStageCount: 0,
        branchStageCount: 0,
        notAllowRandomizeStages: false,
        mapId: "",
        stageSize: "",
      },
      mainCharacter: computed(() =>
        store.getters.getItemsByTag("characters", "Main")
      ),
    });
    const rules = reactive({
      id: [{ required: true, message: "id不能为空", trigger: "blur" }],
      section: [{ required: true, message: "关卡不能为空", trigger: "blur" }],
      displayName: [
        { required: true, message: "名称不能为空", trigger: "blur" },
      ],
    });
    //卡牌数组
    // watchEffect(() => {
    //   state.cardsData = store.getters.getArrayData("cards");
    // });

    // 打开弹窗
    const openDialog = (row: level) => {
      initForm();
      state.isEdit = false;
      if (row.id != undefined) {
        //转为原对象 修改依旧变化 所以深拷贝
        state.isEdit = true;
        state.ruleForm = _.cloneDeep(toRaw(row));
      }
      state.isShowDialog = true;
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    // 取消
    const onCancel = () => {
      closeDialog();
      initForm();
    };
    // 新增
    const onSubmit = () => {
      // 数据，请注意需要转换的类型
      if (state.isEdit) {
        store
          .dispatch(MODIFIY_BY_ID, {
            name: "level",
            id: state.ruleForm.id,
            data: _.cloneDeep(toRaw(state.ruleForm)),
          })
          .then((res) => {
            ElMessage({
              showClose: true,
              message: res,
              type: "success",
            });
          })
          .catch((rej) => {
            ElMessage({
              showClose: true,
              message: rej,
              type: "error",
            });
          });
      } else {
        store
          .dispatch(ADD_STATE_DATA, {
            name: "level",
            id: state.ruleForm.id,
            data: _.cloneDeep(toRaw(state.ruleForm)),
          })
          .then((res) => {
            ElMessage({
              showClose: true,
              message: res,
              type: "success",
            });
          })
          .catch((rej) => {
            ElMessage({
              showClose: true,
              message: rej,
              type: "error",
            });
          });
      }
      closeDialog(); // 关闭弹窗
      initForm(); //清除数据
    };
    const initForm = () => {
      state.ruleForm.id = "";
      state.ruleForm.displayName = "";
      state.ruleForm.section = "";
      state.ruleForm.availableForCharacterId = "";
      state.ruleForm.passageStageCount = 0;
      state.ruleForm.branchStageCount = 0;
      state.ruleForm.notAllowRandomizeStages = false;
      state.ruleForm.mapId = "";
      state.ruleForm.stageSize = "";
    };

    return {
      ...toRefs(state),
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      rules,
    };
  },
};
</script>
