<template>
  <div class="CharacterEditTab">
    <el-form label-position="right" label-width="20%">
      <el-form-item label="单位名称">
        <el-input v-model="characterData.displayName" />
      </el-form-item>
      <el-form-item label="模型ID">
        <el-input v-model="characterData.modelId" />
      </el-form-item>
      <el-form-item label="皮肤ID">
        <el-input v-model="characterData.modelSkinId" />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="characterData.description" />
      </el-form-item>
      <el-form-item label="故事">
        <el-input v-model="characterData.story" />
      </el-form-item>
      <el-form-item label="解锁分数">
        <el-input v-model="characterData.minUnlockGrade" />
      </el-form-item>
      <el-form-item label="小地图的模型ID">
        <el-input v-model="characterData.minimapModelId" />
      </el-form-item>
      <el-form-item label="标签代码">
        <el-input v-model="characterData.tagCode" />
      </el-form-item>
      <el-form-item label="字段代码">
        <el-input v-model="characterData.fieldCode" />
      </el-form-item>
      <el-form-item label="初始手牌数量">
        <el-input v-model="characterData.initialHandCardCount" />
      </el-form-item>
      <el-form-item label="开始回合时抽卡数">
        <el-input v-model="characterData.startTurnDrawHandCardCount" />
      </el-form-item>
      <el-form-item label="自身代码标签">
        <el-input v-model="characterData.selfCardTagCode" />
      </el-form-item>
      <el-form-item label="自身代码">
        <el-input
          v-model="characterData.selfCardCode"
          autosize
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="交互脚本ID">
        <el-input v-model="characterData.interactionPlotId" />
      </el-form-item>
      <el-form-item label="掉落物的过滤器的代码">
        <el-input
          v-model="characterData.dropFilterCode"
          autosize
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="初始运行卡牌">
        <el-select
          multiple
          v-model="characterData.initialRunCardIds"
          placeholder="请选择卡组包含的卡牌"
        >
          <el-option
            v-for="card in cardsData"
            :key="card.id"
            :label="card.id + ' ' + card.displayName"
            :value="card.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="初始的牌库卡牌">
        <el-select
          multiple
          v-model="characterData.cardIds"
          placeholder="请选择卡组包含的卡牌"
        >
          <el-option
            v-for="card in cardsData"
            :key="card.id"
            :label="card.id + ' ' + card.displayName"
            :value="card.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item> <el-button type="primary">保存</el-button></el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { computed, reactive, toRefs } from "vue";
interface characterState {
  characterData: character;
  cardsData: card[];
}
export default {
  name: "CharacterEditTab",
  props: ["paneData"],
  setup(props: { paneData: { id: string } }) {
    const id = props.paneData.id.replace("char-", "");
    console.log(id);
    const store = useStore();
    const state: characterState = reactive({
      characterData: computed(
        (): character => store.getters.getItemById("characters", id)
      ),
      cardsData: computed(() => store.getters.getArrayData("cards")),
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style>
.CharacterEditTab {
  padding: 50px 50px 0 50px;
}
</style>
