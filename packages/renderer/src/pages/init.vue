<template>
  <div>
    <div id="init">
      <el-row>
        <TitleBar title="MOD项目管理"></TitleBar>
      </el-row>
      <el-row type="flex">
        <el-col :span="6" class="left">
          <el-menu
            style="height: 100%"
            :default-active="selectedKeys"
            @select="selectMenu"
          >
            <el-menu-item index="1">本地MOD项目</el-menu-item>
            <el-menu-item index="2">创意工坊MOD</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="18" class="right">
          <ul>
            <li>
              <el-card shadow="hover" class="package new">
                <h1>+</h1>
              </el-card>
            </li>
            <li
              v-if="packages != null"
              v-for="(item, index) in packages"
              :key="index"
              @click="edit(item)"
            >
              <el-card shadow="hover" class="package">
                <img
                  width="160"
                  height="160"
                  style="padding-bottom: 10px"
                  :src="
                    item.icon.src === ''
                      ? '../assets/unknown.png'
                      : item.icon.src
                  "
                  alt="图标"
                />
                <span
                  :class="{
                    fontSize12: item.packageInfo.displayName.length > 15,
                    fontSize10: item.packageInfo.displayName.length > 25,
                  }"
                  >{{ item.packageInfo.displayName }}</span
                >
              </el-card>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import TitleBar from "/@/components/TitleBar.vue";
import { newPage, storeService, fileServices } from "/@/utils";
import { useWinResize } from "/@/hooks/windowEventHooks";
import { Router, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { reactive, ref, computed, onMounted, Ref, watch } from "vue";
import { Store, useStore } from "vuex";
import { INIT_STATE_DATA } from "/@/store/actionType";
export default {
  name: "init",
  components: {
    TitleBar,
  },
  setup() {
    const route = useRouter();
    let clientHight = useWinResize(600);

    let clientHights = useClientHeight(clientHight);
    let selectedKeys = ref("1");
    let packages = reactive([]);
    let paths = reactive({ LocalPackages: "", WorkShop: "" });

    const selectMenu = (index: string) => {
      selectedKeys.value = index;
    };
    //mod编辑 页面跳转
    const store = useStore();
    const edit = useEdit(route, store);
    //菜单选择
    watch(selectedKeys, async () => {
      if (selectedKeys.value == "1") {
        await getPackagesInfo(packages, paths.LocalPackages);
      } else if (selectedKeys.value == "2") {
        await getPackagesInfo(packages, paths.WorkShop);
      }
    });
    onMounted(async () => {
      paths = await storeService.getConfig("paths");
      await getPackagesInfo(packages, paths.LocalPackages);
    });

    return {
      selectedKeys,
      packages,
      selectMenu,
      clientHights,
      edit,
    };
  },
};

const useClientHeight = (clientHight: Ref) =>
  computed(() => {
    return clientHight.value + "px";
  });

//编辑Mod跳转编辑页面
const useEdit =
  (route: Router, store: Store<any>) => (item: ModPackageInfoData) => {
    store.dispatch(INIT_STATE_DATA, { name: "modInfo", data: item });
    newPage([1000, 600], (cb: () => void) => {
      route.push("edit").then(() => cb());
    });
  };
//获取全部包及info信息
const getPackagesInfo = async (
  packages: ModPackageInfoData[],
  path: string
) => {
  packages.length = 0;
  let dirs = await fileServices.getPackages(path);
  if (dirs.length != 0) {
    for (let i = 0; i < dirs.length; i++) {
      const { status, msg, data } = await fileServices.getPackageInfo(dirs[i]);
      if (status == 0) {
        ElMessage({
          showClose: true,
          message: msg,
          type: "error",
        });
      } else {
        if (data != null) {
          packages.push(data);
        }
      }
    }
  }
  // return reactive(packages);
};
</script>

<style>
#init {
  margin: 0;
  overflow: hidden;
  height: 100%;
}
#init .left {
  text-align: left;
  padding-top: 3px;
}
#init .left,
#init .right {
  height: v-bind(clientHights);
  min-height: 600px;
}

#init .right {
  overflow-y: scroll;
  margin-top: 3px;
}

#init .right::-webkit-scrollbar {
  width: 0;
  display: none;
}

#init .right ul {
  padding-bottom: 70px;
  overflow: hidden;
}

#init .right ul li {
  width: 200px;
  height: 220px;
  display: block;
  float: left;
  margin: 12px;
}

#init .right .package {
  /*width: 230px;*/
  /*height: 250px;*/
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  padding: 10px 10px 0 10px;
}
#init .right .el-card__body {
  padding: 8px;
}

#init .right .new {
  font-size: 30px;
  color: #aeaeae;
  line-height: 176px;
}
.fontSize12 {
  font-size: 12px;
}
.fontSize10 {
  font-size: 10px;
}
</style>
