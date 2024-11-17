import { toast } from "react-toastify";

export const customToast = (type, msg, autoClose=2500) => {
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

export const promiseToast = (promiseFunction, msg) => {
  toast.promise(
    promiseFunction,
    {
      pending: msg.pending,
      success: msg.success,
      error: msg.success,
    }
)
}