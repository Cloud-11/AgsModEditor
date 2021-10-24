import { onMounted, ref, onUnmounted } from "vue";

export function useWinResize(baseHeight: number) {
  const clientHeight = ref(baseHeight);
  const onResize = () => {
    clientHeight.value = document.documentElement.clientHeight;
  };
  onMounted(() => {
    window.addEventListener("resize", onResize);
  });
  onUnmounted(() => {
    window.removeEventListener("resize", onResize);
  });
  return clientHeight;
}
