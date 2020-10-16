import { toast } from "react-toastify";

const toastError = (error: any) => {
  toast.error("Error while querying EVE API, systems maybe are in downtime.", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export default toastError;
