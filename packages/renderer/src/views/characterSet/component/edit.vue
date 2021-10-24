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
        <el-form-item label="单位组ID" prop="id">
          <el-col :span="24">
            <el-input v-model="ruleForm.id"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="单位组名称" prop="displayName">
          <el-col :span="24">
            <el-input v-model="ruleForm.displayName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="单位图鉴类别" prop="displayNameInCardLibrary">
          <el-col :span="24">
            <el-input v-model="ruleForm.displayNameInCardLibrary"></el-input>
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
        <el-form-item label="所属关卡" prop="section">
          <el-input
            v-model="ruleForm.section"
            placeholder="请输入所属关卡(默认Shared)"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位组标签" prop="tagCode">
          <el-input
            v-model="ruleForm.tagCode"
            placeholder="请输入卡牌组标签"
          ></el-input>
        </el-form-item>
        <el-form-item label="包含单位" prop="cardIds">
          <el-select
            multiple
            v-model="ruleForm.characterIds"
            placeholder="请选择单位组包含的单位"
          >
            <el-option
              v-for="char in charactersData"
              :key="char.id"
              :label="char.id + ' ' + char.displayName"
              :value="char.id"
            >
            </el-option>
          </el-select>
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
import { computed, reactive, toRaw, toRefs } from "vue";
import _ from "lodash";
import { ADD_STATE_DATA, MODIFIY_BY_ID } from "/@/store/actionType";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
export default {
  name: "charSetEditMenu",
  setup() {
    const store = useStore();
    type charSetDialogState = {
      isShowDialog: boolean;
      isEdit: boolean;
      ruleForm: characterSet;
      charactersData: character[];
    };
    const state: charSetDialogState = reactive({
      isShowDialog: false,
      isEdit: false,
      ruleForm: {
        id: "",
        displayName: "",
        displayNameInCardLibrary: "",
        availableForCharacterId: "",
        section: "Shard",
        spawnPointTag: "",
        tagCode: "",
        characterIds: [],
      },
      charactersData: computed(() => store.getters.getArrayData("characters")),
    });
    const rules = reactive({
      id: [{ required: true, message: "id不能为空", trigger: "blur" }],
      displayName: [
        { required: true, message: "名称不能为空", trigger: "blur" },
      ],
    });
    //卡牌数组
    // watchEffect(() => {
    //   state.charactersData = store.getters.getArrayData("characters");
    // });

    // 打开弹窗
    const openDialog = (row: characterSet) => {
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
            name: "characterSet",
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
            name: "characterSet",
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
      state.ruleForm.displayNameInCardLibrary = "";
      state.ruleForm.availableForCharacterId = "";
      state.ruleForm.section = "";
      state.ruleForm.spawnPointTag = "";
      state.ruleForm.tagCode = "";
      state.ruleForm.characterIds = [];
    };
    let mainCharacter = store.getters.getItemsByTag("characters", "Main");
    return {
      openDialog,
      closeDialog,
      mainCharacter,
      onCancel,
      onSubmit,
      ...toRefs(state),
      rules,
    };
  },
};
</script>
