<script lang="tsx">
import { defineComponent, ref, onMounted, h } from "vue";
import { quit, miniWindow, maxWindow } from "../utils";
export default defineComponent({
  name: "TitleBar",
  props: {
    title: String,
  },
  setup: function (props) {
    const title = props.title;
    const isMaximize = ref(true);
    const maxWin = () => {
      maxWindow(isMaximize.value);
      isMaximize.value = !isMaximize.value;
    };
    onMounted(() => {
      //默认执行小窗口
      maxWin();
    });
    return () => (
      <div class="title_bar">
        <div class="title">{title} - AGS ModEditor 2021.1</div>
        <div class="closeBox" onClick={quit}>
          <i class="el-icon-close" />
        </div>
        <div class="zoomBox" onClick={maxWin}>
          {isMaximize.value ? (
            <i class="el-icon-copy-document" />
          ) : (
            <i class="el-icon-full-screen" />
          )}
        </div>
        <div class="miniBox" onClick={miniWindow}>
          <i class="el-icon-minus" />
        </div>
      </div>
    );
  },
});
</script>
<style>
.title_bar {
  width: 100%;
  height: 35px;
  box-shadow: 0 -2px 5px 3px #e8e8e8;
  -webkit-user-select: none;
  -webkit-app-region: drag;
}

.title {
  /* width: 88.5%; */
  float: left;
  height: 100%;
  margin: 5px;
  text-align: left;
}

.closeBox,
.zoomBox,
.miniBox {
  float: right;
  width: 35px;
  height: 35px;
  padding-top: 7.5px;
  cursor: pointer;
  -webkit-app-region: no-drag;
}
.zoomBox:hover,
.miniBox:hover {
  background-color: #d1d1d1;
}
.closeBox:hover {
  color: #ffffff;
  background-color: #e96464;
}
</style>
