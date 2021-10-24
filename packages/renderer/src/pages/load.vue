<template>
  <div><div id="load" /></div>
</template>

<script lang="ts">
import { newPage, storeService } from "/@/utils";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

export default {
  name: "load",
  setup() {
    const route = useRouter();
    onMounted(async () => {
      const data = await storeService.getConfig("paths.GameRootPath");
      console.log(data);
      if (data == null || data == "") {
        setTimeout(() => {
          // newPage(route,"setting",[500, 600]);
          // route.push({ name: "setting" });
          newPage([500, 600], (cb: () => void) => {
            route.push({ name: "setting" }).then(() => cb());
          });
        }, 1000);
      } else {
        setTimeout(() => {
          newPage([1000, 600], (cb: () => void) => {
            route.push({ name: "init" }).then(() => cb());
          });
        }, 1000);
      }
    });
  },
};
</script>
<style>
#load {
  margin: 0;
  width: 754px;
  height: 427px;
  background: url("../assets/load.png") no-repeat;
  background-size: cover;
  overflow: hidden;
}
</style>
