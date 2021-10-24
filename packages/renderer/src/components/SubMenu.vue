<template>
  <el-sub-menu :index="parentItem.name">
    <template #title>
      <i class="el-icon-menu" />
      <span>{{ parentItem.title }}</span>
    </template>
    <template v-for="item in parentItem.children">
      <SubMenu v-if="item.children?.length > 0" :parent-item="item" />
      <el-menu-item v-else :index="item.name">{{ item.title }}</el-menu-item>
    </template>
  </el-sub-menu>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SubMenu",
  props: {
    parentItem: {
      type: Object,
      default: () => {},
    },
  },
});
</script>
