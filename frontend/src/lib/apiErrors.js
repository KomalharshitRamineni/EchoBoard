import toast from "react-hot-toast";

const ERROR_TOAST_DURATION = 4000;

// Maps API error responses to user-facing toast notifications
export function handleApiError(error, fallbackMessage) {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  const toastOptions = (icon) => ({ duration: ERROR_TOAST_DURATION, icon });

  switch (status) {
    case 400:
      toast.error(message, toastOptions("❗"));
      break;
    case 422:
      toast.error(message, toastOptions("🚫"));
      break;
    case 429:
      toast.error(message, toastOptions("⏳"));
      break;
    case 503:
      toast.error(message, toastOptions("⚙️"));
      break;
    default:
      console.error(fallbackMessage, error);
      toast.error(fallbackMessage);
  }
}