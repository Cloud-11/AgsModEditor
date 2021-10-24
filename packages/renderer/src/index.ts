import { createApp, defineAsyncComponent } from "vue";
import router from "/@/router";
import ElementPlus from "element-plus";
import store from "/@/store";
import "element-plus/dist/index.css";
import "/@/styles/reset.css";
import "/@/styles/index.css";
const app = createApp(
  defineAsyncComponent({
    loader: () => import("/@/App.vue"),
    delay: 200,
    // timeout: 3000
    // loadingComponent: PublicAPIComponent)
    // errorComponent: PublicAPIComponent,
  })
);
app.use(ElementPlus);
app.use(router);
app.use(store);
router.isReady().then(() => {
  app.mount("#app");
});
