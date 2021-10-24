<template>
  <div class="ModInfoTab">
    <el-form label-position="right" label-width="20%">
      <el-form-item label="MOD图标">
        <div class="iconBox">
          <img
            width="200"
            height="200"
            style="padding: 10px"
            :src="
              modInfo.icon.src === ''
                ? '../assets/unknown.png'
                : modInfo.icon.src
            "
            alt="图标"
          />
        </div>
      </el-form-item>
      <el-form-item label="MOD名称">
        <el-input v-model="modInfo.packageInfo.displayName" />
      </el-form-item>
      <el-form-item label="MOD包含标签">
        <el-select
          multiple
          size="medium"
          v-model="modInfo.packageInfo.publishedTags"
          placeholder="请选择MOD包含标签"
        >
          <el-option
            v-for="(tag, key) in modTags"
            :key="tag"
            :label="tag"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="MOD当前进度">
        <el-slider
          v-model="modInfo.packageInfo.completionProgressPercent"
          show-input
        ></el-slider>
      </el-form-item>

      <el-form-item label="MOD更新次数">
        <span>{{ modInfo.packageInfo.version }}</span></el-form-item
      ><el-form-item label="MOD是否隐藏">
        <el-switch
          v-model="modInfo.packageInfo.visibility"
          active-text="隐藏"
          inactive-text="显示"
      /></el-form-item>
      <el-form-item> <el-button type="primary">保存</el-button></el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from "vue";
import { useStore } from "vuex";
interface modInfoState {
  modTags: { [key: string]: string };
  modInfo: ModPackageInfoData;
}
export default {
  name: "ModInfoTab",
  setup() {
    const store = useStore();
    const state: modInfoState = reactive({
      modTags: {
        Card: "卡牌",
        Character: "角色",
        Stage: "场景",
        Effect: "特效",
        Music: "音乐",
        Tool: "工具",
      },
      modInfo: store.state["modInfo"],
    });
    //设置进度条数字
    initPercentNum(state);
    return { ...toRefs(state) };
  },
};
const initPercentNum = (state: modInfoState) => {
  let num = state.modInfo.packageInfo.completionProgressPercent;
  state.modInfo.packageInfo.completionProgressPercent =
    num < 1 ? parseFloat(num.toFixed(4)) * 100 : num;
};
</script>

<style>
.ModInfoTab {
  padding: 50px 50px 0 50px;
}
.ModInfoTab .iconBox {
  width: 200px;
  border: 1px solid #ccc;
}
</style>
