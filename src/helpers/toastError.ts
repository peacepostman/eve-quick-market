import { toast } from "react-toastify";

const toastError = (error: any) => {
  toast.error(error.error, {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export default toastError;
