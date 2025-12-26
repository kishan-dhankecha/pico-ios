import { ref } from "vue";

const isVisible = ref(false);
const message = ref("");
const type = ref("success"); // 'success', 'error', 'info'

export function useToast() {
  const showToast = (msg, msgType = "success") => {
    message.value = msg;
    type.value = msgType;
    isVisible.value = true;

    // auto-hide after 2s
    setTimeout(() => {
      isVisible.value = false;
    }, 2000);
  };

  return {
    isVisible,
    message,
    type,
    showToast,
  };
}
