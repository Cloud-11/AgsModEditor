<template>
  <div id="setting">
    <TitleBar title="基础设置" />
    <div class="context">
      <p class="lable">
        原石计划安装目录
        <span style="color: red">*</span>
      </p>
      <el-input
        v-model:value="paths.GameRootPath"
        placeholder="例：F:\SteamLibrary\steamapps\common\Tetra Project"
        style="width: 80%"
      />
      <el-button class="chooseBtn" @click="openDiago('GameRootPath')">
        选择
      </el-button>
      <p class="lable">Aseprite软件路径</p>
      <el-input
        v-model:value="paths.AsepritePath"
        placeholder="例：E:\Program Files\Aseprite\Aseprite.exe"
        style="width: 80%"
      />
      <el-button class="chooseBtn" @click="openDiago('AsepritePath')">
        选择
      </el-button>
      <p class="lable">MagicaVoxel软件路径</p>
      <el-input
        v-model:value="paths.MagicaVoxelPath"
        placeholder="例：E:\Program Files\MagicaVoxel\MagicaVoxel.exe"
        style="width: 80%"
      />
      <el-button class="chooseBtn" @click="openDiago('MagicaVoxelPath')">
        选择
      </el-button>
      <p class="lable">Tiled关卡编辑器软件路径</p>
      <el-input
        v-model:value="paths.TiledPath"
        placeholder="例：E:\Program Files\Tiled\tiled.exe"
        style="width: 80%"
      />
      <el-button class="chooseBtn" @click="openDiago('TiledPath')">
        选择
      </el-button>
    </div>
    <el-button class="finish" type="primary" @click="finish"> 完成 </el-button>
  </div>
</template>

<script lang="ts">
import TitleBar from "/@/components/TitleBar.vue";
import { reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { newPage, fileServices, storeService } from "/@/utils";
const remote = require("electron").remote;
import { ElMessageBox, ElMessage } from "element-plus";

export default {
  name: "Setting",
  components: {
    TitleBar,
  },
  setup() {
    const route = useRouter();
    const state = reactive({
      paths: {
        GameRootPath: "",
        AsepritePath: "",
        MagicaVoxelPath: "",
        TiledPath: "",
      },
    });
    //打开目录选择路径
    const openDiago = (key: string): void => {
      const option = {
        title: "选择文件",
        properties: ["openDirectory"],
        filters: [{}],
      };
      if (key != "GameRootPath") {
        option.filters = [{ name: "Exe", extensions: ["exe"] }];
        option.properties = ["openFile"];
      }
      remote.dialog
        .showOpenDialog(option)
        .then(
          ({
            canceled,
            filePaths,
          }: {
            canceled: boolean;
            filePaths: string[];
          }) => {
            if (canceled || filePaths.length === 0) {
              return;
            }
            Reflect.set(state.paths, key, filePaths[0]);
          }
        );
    };
    //校验文件路径
    const checkFilePath = async () => {
      for (let key in state.paths) {
        console.log(key);
        if (
          Reflect.get(state.paths, key) != null &&
          Reflect.get(state.paths, key) != ""
        ) {
          let content;
          let result;
          key == "GameRootPath"
            ? (content = "原石计划安装目录校验失败！")
            : (content = `${key}软件路径校验失败！`);
          try {
            const stat = await fileServices.checkFile(
              Reflect.get(state.paths, key)
            );
            key == "GameRootPath"
              ? (result = stat.isDirectory())
              : (result = stat.isFile());
            console.log(result);
          } catch (error) {
            ElMessage.error(content);
            return false;
          }
          if (!result) {
            ElMessage.error(content);
            return false;
          }
          await storeService.setConfig(
            `paths.${key}`,
            Reflect.get(state.paths, key)
          );
        }
      }
      return true;
    };

    //提交
    const finish = () => {
      // const paths = unref(paths);
      console.log(state.paths.GameRootPath);
      if (state.paths.GameRootPath == "") {
        ElMessageBox({
          title: "原石计划游戏安装目录必须输入!",
        });
        return;
      }
      if (checkFilePath()) {
        let workshop =
          remote.app.getPath("home") +
          "\\AppData\\LocalLow\\AliveGameStudio\\TetraProject\\Workshop\\Packages";
        storeService.setConfig("paths.WorkShop", workshop);
        newPage([1000, 600], () => {
          route.push({ name: "init" });
        });
      }
    };
    return {
      ...toRefs(state),
      openDiago,
      finish,
    };
  },
};
</script>

<style>
#setting {
  margin: 0;
  width: 500px;
  height: 600px;
  border-radius: 20px;
}
.context {
  padding: 20px;
}

.chooseBtn {
  margin-left: 10px;
}
.lable {
  margin: 10px 0 10px 10px;
  text-align: left;
}
.finish {
  display: block;
  position: absolute;
  bottom: 30px;
  right: 50px;
}
</style>
