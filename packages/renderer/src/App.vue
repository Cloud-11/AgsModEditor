<template>
  <router-view id="content" />
</template>

<script lang="ts">
import { storeService, HOME_PATH } from "/@/utils";

export default {
  name: "app",
  created() {
    //初始化设置本地包路径
    if (!storeService.getConfig("paths.LocalPackages")) {
      storeService.setConfig(
        "paths.LocalPackages",
        `${HOME_PATH}\\Documents\\TetraProject\\Packages`
      );
    }
  },
};
</script>

<style scoped>
/*#root {*/
/*  display: grid;*/
/*  height: 100vh;*/
/*  grid-template-rows: auto 1fr;*/
/*  background-color: #282c34;*/
/*}*/
/*#content {*/
/*  padding: 15px;*/
/*  color: #666666;*/
/*}*/
#edit .right .el-card__body {
  padding: 8px;
}
</style>
