import { toast } from "react-toastify";

export const toastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

export const notifySuccessfull = () => {
  toast.success("Message sent successfully!", toastOptions);
};

export const notifyFailure = (
  message = "We are facing an issue in processing the request. Please try again in some time!"
) => {
  toast.error(`${message}`, toastOptions);
};
