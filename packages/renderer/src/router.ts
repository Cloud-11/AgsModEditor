import { createRouter, createWebHashHistory } from "vue-router";
import load from "/@/pages/load.vue";

const routes = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "load",
      component: load,
    },
    {
      path: "/init",
      name: "init",
      component: () => import("/@/pages/init.vue"),
    },
    {
      path: "/edit",
      name: "edit",
      component: () => import("/@/pages/edit.vue"),
    },
    // {
    //   path: '/setting',
    //   name: 'setting',
    //   component: () => import('/@/pages/setting.vue'),
    // },
  ],
});

export default routes;
