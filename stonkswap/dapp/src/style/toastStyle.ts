import { ToastOptions } from "react-hot-toast/dist/core/types";
import { getColor } from "./constants/color";

export const toastStyle: ToastOptions = {
  style: {
    border: `3px solid ${getColor("text")}`,
    padding: "16px",
    color: getColor("text"),
    borderRadius: "1rem",
    opacity: 1,
    fontWeight: 600,
  },
  iconTheme: {
    primary: getColor("theme"),
    secondary: getColor("text"),
  },
  duration: 10 * 1000,
};
