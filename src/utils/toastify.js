import { toast } from "react-toastify";

export const customToast = (type, msg, autoClose=2500) => {
  console.log(`toast ${type}: `, msg) // log
  toast[type](msg, {
    position: "top-right",
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};