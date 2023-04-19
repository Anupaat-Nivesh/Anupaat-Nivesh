import { ToastContainer, toast } from "react-toastify";

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

export const notifySuccessfull = () =>{
  toast.success("Message sent successfully! 😀", toastOptions);
}

export const notifyFailure = (message) =>{
  toast.error(
      `${message}.Try again in some time!`,
      toastOptions
  );
}