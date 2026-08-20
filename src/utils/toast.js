import { toast } from "react-hot-toast";

const toastConfig = {
  duration: 3000,
  position: "top-center",
};

const notify = {
  success: (message) =>
    toast.success(message, toastConfig),

  error: (message) =>
    toast.error(message, toastConfig),

  info: (message) =>
    toast(message, {
      icon: "ℹ️",
      ...toastConfig,
    }),

  warning: (message) =>
    toast(message, {
      icon: "⚠️",
      ...toastConfig,
    }),

  loading: (message) =>
    toast.loading(message),

  dismiss: (id) =>
    toast.dismiss(id),
};

export default notify;