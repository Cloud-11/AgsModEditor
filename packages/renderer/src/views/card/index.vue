<template>
  <div class="CardEditTab">
    <el-form label-position="right" label-width="20%">
      <el-form-item label="卡牌名称">
        <el-input v-model="cardData.displayName" />
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="cardData.price" />
      </el-form-item>
      <el-form-item label="能量">
        <el-input v-model="cardData.energyReq" />
      </el-form-item>
      <el-form-item label="射程">
        <el-input v-model="cardData.range" />
      </el-form-item>
      <el-form-item label="扩散半径">
        <el-input v-model="cardData.spreadRadius" />
      </el-form-item>
      <el-form-item label="扩散范围形状">
        <el-input v-model="cardData.spreadShapeTextureId" />
      </el-form-item>
      <el-form-item label="瞄准类型代码">
        <el-input v-model="cardData.aimTypeCode" />
      </el-form-item>
      <el-form-item label="首选目标代码">
        <el-input v-model="cardData.perferredTargetTypeCode" />
      </el-form-item>
      <el-form-item label="标签代码">
        <el-input v-model="cardData.tagCode" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="cardData.description" />
      </el-form-item>
      <el-form-item label="直接代码">
        <el-input v-model="cardData.code" autosize type="textarea" />
      </el-form-item>
      <el-form-item label="映射代码">
        <el-input v-model="cardData.remapCode" autosize type="textarea" />
      </el-form-item>
      <el-form-item label="卡背图片">
        <el-input v-model="cardData.backgroundId" />
      </el-form-item>
      <el-form-item label="特效ID">
        <el-input v-model="cardData.effectCode" />
      </el-form-item>
      <el-form-item label="解锁分数">
        <el-input v-model="cardData.minUnlockGrade" />
      </el-form-item>
      <el-form-item label="故事">
        <el-input v-model="cardData.story" />
      </el-form-item>
      <el-form-item label="角色皮肤">
        <el-input v-model="cardData.characterModelSkinId" />
      </el-form-item>
      <el-form-item> <el-button type="primary">保存</el-button></el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { computed, reactive, toRefs } from "vue";
interface cardState {
  cardData: card[];
}
export default {
  name: "CardEditTab",
  props: ["paneData"],
  setup(props: { paneData: { id: string } }) {
    const id = props.paneData.id.replace("card-", "");
    const store = useStore();
    const state: cardState = reactive({
      cardData: computed((): card[] => store.getters.getItemById("cards", id)),
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style>
.CardEditTab {
  padding: 50px 50px 0 50px;
}
</style>
